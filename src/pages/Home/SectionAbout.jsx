import './style.less';

const SectionAbout = () => {
  return (
    <div className="section-content">
      <div className="content-card">
        <h2 className="section-title">关于本站</h2>
        <div className="card-scrollable-content">
          <p className="section-description">CLANNAD是Key社制作的经典视觉小说游戏</p>
          <div className="content-placeholder">
            <div className="placeholder-item">故事背景</div>
            <div className="placeholder-item">角色介绍</div>
            <div className="placeholder-item">游戏特色</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionAbout;
