const brands = [
  { name:'中国建筑学会室内设计分会', image:'/brands/architectural-society.png' },
  { name:'炁象', image:'/brands/qixiang.png' },
  { name:'双流区民族宗教事务局', image:'/brands/shuangliu-ethnic-religious-bureau.png' },
  { name:'西南民族大学畜牧兽医学院', image:'/brands/veterinary-college.png' },
  { name:'西南民族大学法学院', image:'/brands/law-school.png' },
  { name:'西南民族大学图书馆', image:'/brands/university-library.png' },
  { name:'中西部设计竞赛', image:'/brands/midwest-design-competition.png' },
  { name:'FD', image:'/brands/fd.png' },
  { name:'FOCUS DESIGN 设计平台', image:'/brands/focus-design.png' },
  { name:'JZ', image:'/brands/jz.png' },
  { name:'梁建国环境设计与陈设艺术研究所', image:'/brands/liang-jg.png' },
  { name:'MD', image:'/brands/md.png' },
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
