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

  window.CMS.registerPreviewStyle('/admin/preview.css');
  window.CMS.registerPreviewTemplate('projects', PortfolioPreview);
  window.__LJH_PREVIEW_REGISTERED__ = true;
  document.documentElement.dataset.cmsPreview = 'registered';
})();
