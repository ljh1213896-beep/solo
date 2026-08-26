export type Project = {
  no: string;
  slug: string;
  year: string;
  title: string;
  en: string;
  type: string;
  image: string;
  video?: string;
  location: string;
  role: string;
  summary: string;
  concept: string;
  keywords: string[];
};

export const projects: Project[] = [
  { no:'01', slug:'salt-lake-habitat', year:'2025', title:'循“析”而栖', en:'Dwelling Through Analysis', type:'LANDSCAPE / ECOLOGY', image:'/projects/salt-lake.jpg', video:'/projects/salt-lake-walkthrough.mp4', location:'运城 · 山西', role:'景观设计 / 生境研究', summary:'运城盐湖盐畦肌理下的多层次生境营建与游赏系统设计。', concept:'从盐畦的尺度、路径和水文节律出发，将生态修复、候鸟生境与人的游赏体验组织为连续的空间系统。', keywords:['盐湖生境','生态修复','游赏系统','场地研究'] },
  { no:'02', slug:'medieval-pirate', year:'2024', title:'Medieval Pirate', en:'A Medieval Narrative Store', type:'INTERIOR / RETAIL', image:'/projects/medieval-pirate.jpg', video:'/projects/medieval-pirate-walkthrough.mp4', location:'成都 · 四川', role:'室内设计 / 叙事空间', summary:'中世纪海盗叙事角度下的中世纪元素中古店。', concept:'以航海、舱室与藏宝路径为叙事线索，让陈列、材质和光线共同塑造可探索的零售体验。', keywords:['中古商业','叙事空间','室内设计','品牌体验'] },
  { no:'03', slug:'digital-nomad', year:'2024', title:'从“游走”到“扎根”', en:'From Roaming to Rooting', type:'WORKPLACE / COMMUNITY', image:'/projects/digital-nomad.jpg', video:'/projects/digital-nomad-walkthrough.mp4', location:'成都 · 四川', role:'空间设计 / 社区研究', summary:'面向数字游民的社区办公空间设计。', concept:'把临时办公、共享生活与社群协作叠合在同一套弹性空间中，让短暂停留逐渐形成地方连接。', keywords:['数字游民','社区办公','共享空间','弹性系统'] },
  { no:'04', slug:'autumn-market', year:'2024', title:'秋风市集', en:'Autumn Breeze Market', type:'URBAN RENEWAL / MARKET', image:'/projects/autumn-market.jpg', video:'/projects/autumn-market-walkthrough.mp4', location:'成都 · 四川', role:'城市更新 / 空间策划', summary:'城市更新背景下的创意集市空间设计。', concept:'利用可生长的摊位模块、公共活动界面和昼夜转换机制，为旧场地植入持续发生的城市生活。', keywords:['城市更新','创意市集','公共空间','模块系统'] },
  { no:'05', slug:'tidal-moon-library', year:'2023', title:'汐月书庭', en:'Tidal Moon Reading Court', type:'INTERIOR / RENOVATION', image:'/projects/library.jpg', video:'/projects/tidal-moon-library-walkthrough.mp4', location:'成都 · 四川', role:'室内改造 / 学习空间', summary:'西南民族大学航空港校区图书馆改造。', concept:'以潮汐般的动线和庭院式共享节点重组阅读场景，在安静学习与开放交流之间建立层次。', keywords:['图书馆改造','学习空间','校园更新','室内设计'] },
  { no:'06', slug:'myriad-formless', year:'2025', title:'萬千炁象', en:'WANQIAN QIXIANG', type:'VISUAL IDENTITY / SYSTEM', image:'/projects/qixiang-cover.webp?v=2', video:'/projects/qixiang-cover.mp4?v=2', location:'成都 · 四川', role:'品牌设计 / 视觉系统', summary:'以“炁”为原点，构建连接个体、自然与万象的视觉形象系统。', concept:'从台风与气流的旋转形态中提炼环形标识，以红白秩序、细线网格和可变几何建立持续生长的品牌语言。', keywords:['炁象','视觉识别','品牌系统','动态设计'] },
  { no:'07', slug:'experiments', year:'2022—25', title:'其他作品', en:'Experiments & Studies', type:'RENDER / PHOTO / STUDY', image:'/projects/other-works.jpg', location:'中国', role:'渲染 / 摄影 / 课程实验', summary:'渲染作品、摄影作品与课程设计的持续实验档案。', concept:'记录不同尺度、媒介和技术路径中的视觉试验，把未完成的探索保留为下一次设计的起点。', keywords:['空间渲染','摄影','课程设计','实验研究'] },
];

export function getProject(slug: string) {
  return projects.find(project => project.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex(project => project.slug === slug);
  return projects[(index + 1 + projects.length) % projects.length];
}
