(function registerPortfolioPreview() {
  if (!window.CMS || !window.createClass || !window.h) {
    window.setTimeout(registerPortfolioPreview, 60);
    return;
  }

  var h = window.h;

  function text(value, fallback) {
    return value === undefined || value === null || value === ''
      ? fallback || ''
      : String(value);
  }

  function assetUrl(getAsset, value) {
    if (!value) return '';

    try {
      var asset = getAsset(value);
      return asset ? asset.toString() : String(value);
    } catch (_error) {
      return String(value);
    }
  }

  var PortfolioPreview = window.createClass({
    render: function render() {
      var projectList = this.props.entry.getIn(['data', 'projects']);
      var projects = projectList && projectList.toJS ? projectList.toJS() : [];
      var getAsset = this.props.getAsset;

      return h(
        'main',
        { className: 'portfolio-live-preview' },
        h(
          'header',
          { className: 'preview-topbar' },
          h('div', { className: 'preview-brand' },
            h('span', {}, 'LJH'),
            h('b', {}, 'CONTENT STUDIO')
          ),
          h('p', {}, '实时预览 · 修改内容会同步显示'),
          h('span', { className: 'preview-count' }, text(projects.length, '0') + ' PROJECTS')
        ),
        h(
          'section',
          { className: 'preview-intro' },
          h('span', {}, 'PORTFOLIO / VISUAL EDITOR'),
          h('h1', {}, '作品封面与文字预览'),
          h('p', {}, '在左侧展开任意项目。标题、说明、地点、关键词和新上传的封面会立即反映在这里。')
        ),
        projects.length
          ? projects.map(function mapProject(project, index) {
              var image = assetUrl(getAsset, project.image);
              var keywords = Array.isArray(project.keywords) ? project.keywords : [];

              return h(
                'article',
                { className: 'preview-project', key: project.slug || index },
                h(
                  'div',
                  {
                    className: 'preview-cover' + (image ? '' : ' is-empty'),
                    style: image ? { backgroundImage: 'url("' + image.replace(/"/g, '%22') + '")' } : {},
                  },
                  h('span', { className: 'preview-cover-index' }, text(project.no, String(index + 1).padStart(2, '0'))),
                  h('span', { className: 'preview-cover-type' }, text(project.type, 'PROJECT TYPE')),
                  h('div', { className: 'preview-cover-grid' }),
                  h(
                    'div',
                    { className: 'preview-cover-title' },
                    h('p', {}, text(project.year, 'YEAR') + ' · ' + text(project.location, 'LOCATION')),
                    h('h2', {}, text(project.title, '未命名项目')),
                    h('h3', {}, text(project.en, 'ENGLISH TITLE'))
                  )
                ),
                h(
                  'div',
                  { className: 'preview-project-copy' },
                  h(
                    'div',
                    { className: 'preview-project-heading' },
                    h('span', {}, text(project.no, '00') + ' / ' + text(project.year, '—')),
                    h('h4', {}, text(project.fullTitle, project.title || '未填写完整项目标题')),
                    h('p', {}, text(project.role, '未填写负责内容'))
                  ),
                  h(
                    'div',
                    { className: 'preview-project-body' },
                    h('p', { className: 'preview-summary' }, text(project.summary, '在左侧填写项目摘要。')),
                    h('p', { className: 'preview-concept' }, text(project.concept, '在左侧填写设计概念。')),
                    h(
                      'ul',
                      { className: 'preview-keywords' },
                      keywords.length
                        ? keywords.map(function mapKeyword(keyword, keywordIndex) {
                            return h('li', { key: keywordIndex }, text(keyword, '关键词'));
                          })
                        : h('li', {}, '添加关键词')
                    )
                  )
                )
              );
            })
          : h(
              'section',
              { className: 'preview-empty' },
              h('span', {}, 'NO PROJECT DATA'),
              h('h2', {}, '请在左侧添加项目内容')
            ),
        h(
          'footer',
          { className: 'preview-footer' },
          h('span', {}, 'LI JIANHUA · SPATIAL & ENVIRONMENTAL DESIGNER'),
          h('b', {}, 'PREVIEW END')
        )
      );
    },
  });

  function entryData(props) {
    var data = props.entry.get('data');
    return data && data.toJS ? data.toJS() : {};
  }

  function PreviewShell(children) {
    return h('main', { className: 'content-live-preview' },
      h('header', { className: 'preview-topbar' },
        h('div', { className: 'preview-brand' }, h('span', {}, 'LJH'), h('b', {}, 'CONTENT STUDIO')),
        h('p', {}, '实时内容预览'),
        h('span', { className: 'preview-count' }, 'LIVE')
      ),
      children
    );
  }

  var HomePreview = window.createClass({
    render: function render() {
      var data = entryData(this.props);
      var hero = data.hero || {};
      var principles = Array.isArray(data.principles) ? data.principles : [];
      var gallery = data.gallery || {};
      return PreviewShell(h('div', { className: 'cms-page-preview cms-home-preview' },
        h('span', { className: 'cms-kicker' }, text(hero.tag, '00 / INTRODUCTION')),
        h('h1', {}, text(hero.mainTitle, '首页标题')),
        h('p', { className: 'cms-subtitle' }, text(hero.subtitle, 'HOMEPAGE SUBTITLE')),
        h('h2', {}, text(hero.linePrefix) + text(hero.lineEmphasis) + text(hero.lineMiddle) + text(hero.lineStrong)),
        h('p', {}, text(hero.lineEnglish)),
        h('div', { className: 'cms-principles' }, principles.map(function(item,index){
          return h('article', { key:index }, h('span', {}, text(item.tag, '0' + (index + 1))), h('h3', {}, text(item.title, '理念标题')), h('p', {}, text(item.copy, '理念说明')));
        })),
        h('div', { className: 'cms-preview-band' }, text(gallery.marquee, 'OUR WORK · SELECTED PROJECTS · ARCHIVE'))
      ));
    },
  });

  var MenuPreview = window.createClass({
    render: function render() {
      var data = entryData(this.props);
      var items = Array.isArray(data.items) ? data.items : [];
      return PreviewShell(h('div', { className: 'cms-page-preview cms-menu-preview' },
        h('span', { className: 'cms-kicker' }, text(data.closeLabel, 'CLOSE ×')),
        h('nav', {}, items.map(function(item,index){ return h('div', { key:index }, h('span', {}, '0' + (index + 1)), h('b', {}, text(item.label, '菜单项目')), h('small', {}, text(item.href, '#section'))); })),
        h('p', { className: 'cms-menu-footer' }, text(data.footer, 'DESIGN DISCIPLINES'))
      ));
    },
  });

  var ProfilePreview = window.createClass({
    render: function render() {
      var data = entryData(this.props);
      var portrait = assetUrl(this.props.getAsset, data.portrait);
      var skills = Array.isArray(data.skills) ? data.skills : [];
      var awards = Array.isArray(data.academicAwards) ? data.academicAwards : [];
      return PreviewShell(h('div', { className: 'cms-page-preview cms-profile-preview' },
        h('div', { className: 'cms-profile-hero' },
          portrait ? h('img', { src:portrait, alt:text(data.name, '个人肖像') }) : h('div', { className:'cms-media-empty' }, 'PORTRAIT'),
          h('div', {}, h('span', { className:'cms-kicker' }, text(data.role, '个人定位')), h('h1', {}, text(data.name, '姓名')), h('h2', {}, text(data.nameEnglish, 'NAME')), h('p', {}, text(data.introduction, '个人简介')), h('small', {}, text(data.introductionEnglish, 'English introduction')))
        ),
        h('div', { className:'cms-chip-list' }, skills.map(function(skill,index){ return h('span', { key:index }, text(skill, 'SKILL')); })),
        h('div', { className:'cms-award-list' }, awards.map(function(item,index){ return h('p', { key:index }, h('b', {}, text(item.title, '奖项')), h('em', {}, text(item.award, '—'))); }))
      ));
    },
  });

  var DetailPreview = window.createClass({
    render: function render() {
      var data = entryData(this.props);
      var hero = data.hero || {};
      var sections = Array.isArray(data.sections) ? data.sections : [];
      var heroImage = assetUrl(this.props.getAsset, hero.image || hero.poster);
      var getAsset = this.props.getAsset;
      return PreviewShell(h('div', { className:'cms-page-preview cms-detail-preview' },
        h('section', { className:'cms-detail-hero', style:heroImage ? { backgroundImage:'url("' + heroImage.replace(/"/g, '%22') + '")' } : {} },
          h('span', { className:'cms-kicker' }, text(data.slug, 'PROJECT DETAIL')),
          h('h1', {}, sections[0] ? text(sections[0].title, '作品内页') : '作品内页'),
          h('p', {}, hero.video ? 'VIDEO HERO · ' + hero.video : text(hero.alt, 'PROJECT MEDIA'))
        ),
        sections.map(function(section,sectionIndex){
          var mediaItems = Array.isArray(section.media) ? section.media : [];
          return h('section', { className:'cms-detail-section', key:section.id || sectionIndex },
            h('header', {}, h('span', {}, text(section.id, String(sectionIndex + 1).padStart(2,'0')) + ' / ' + String(sections.length).padStart(2,'0')), h('h2', {}, text(section.title, '章节标题')), h('p', {}, text(section.en, 'SECTION TITLE'))),
            section.text ? h('blockquote', {}, section.text) : null,
            section.video ? h('div', { className:'cms-video-path' }, 'VIDEO · ' + section.video) : null,
            h('div', { className:'cms-media-grid' }, mediaItems.slice(0, 30).map(function(item,index){
              var image = assetUrl(getAsset, item.image);
              return h('figure', { key:index }, image ? h('img', { src:image, alt:text(item.caption, section.title) }) : h('div', { className:'cms-media-empty' }, 'IMAGE'), h('figcaption', {}, text(item.caption, String(index + 1).padStart(2,'0'))));
            })),
            mediaItems.length > 30 ? h('p', { className:'cms-more-media' }, '另有 ' + (mediaItems.length - 30) + ' 张素材，已保留在当前章节中') : null
          );
        })
      ));
    },
  });

  window.CMS.registerPreviewStyle('/admin/preview.css');
  window.CMS.registerPreviewTemplate('projects', PortfolioPreview);
  window.CMS.registerPreviewTemplate('home', HomePreview);
  window.CMS.registerPreviewTemplate('menu', MenuPreview);
  window.CMS.registerPreviewTemplate('profile', ProfilePreview);
  ['detail_salt_lake','detail_tidal_moon','detail_qixiang','detail_medieval_pirate','detail_digital_nomad','detail_autumn_market','detail_experiments'].forEach(function(name){
    window.CMS.registerPreviewTemplate(name, DetailPreview);
  });
  window.__LJH_PREVIEW_REGISTERED__ = true;
  document.documentElement.dataset.cmsPreview = 'registered';
})();
