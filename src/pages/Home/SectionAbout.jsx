import './style.less';

const SectionAbout = () => {
  return (
    <div className="page-content">
      <h2 className="page-title">关于本站</h2>
      <p className="page-description">CLANNAD是Key社制作的经典视觉小说游戏</p>
      <div className="content-grid">
        <div className="content-item">故事背景</div>
        <div className="content-item">角色介绍</div>
        <div className="content-item">游戏特色</div>
      </div>
    </div>
  );
};

export default SectionAbout;
