const brands = [
  { name:'中国建筑学会室内设计分会', image:'/brands/architectural-society.png' },
  { name:'FOCUS DESIGN 设计平台', image:'/brands/focus-design.png' },
  { name:'梁建国环境设计与陈设艺术研究所', image:'/brands/liang-jg.png' },
  { name:'中西部城市精英设计师教学实践设计竞赛', image:'/brands/midwest-design-competition.png' },
  { name:'蓉城一家亲', image:'/brands/rongcheng-family.png' },
  { name:'西南民族大学建筑学院', image:'/brands/school-of-architecture.png' },
  { name:'西南民族大学', image:'/brands/southwest-minzu-university.png' },
  { name:'畜牧兽医学院', image:'/brands/veterinary-college.png' },
];

export default function BrandMarquee() {
  return <div className="brand-marquee" aria-label="合作机构">
    <div className="brand-marquee-track">
      {[0, 1].map(group => <div className="brand-marquee-set" aria-hidden={group === 1} key={group}>
        {brands.map(brand => <figure key={`${group}-${brand.name}`}><img src={brand.image} alt={group === 0 ? brand.name : ''} /></figure>)}
      </div>)}
    </div>
  </div>;
}
