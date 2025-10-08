import './style.less';

const SectionAlbum = () => {
  return (
    <div className="page-content">
      <h2 className="page-title">游戏攻略</h2>
      <p className="page-description">完整的游戏流程攻略和成就指南</p>
      <div className="content-grid">
        <div className="content-item">主线攻略</div>
        <div className="content-item">支线任务</div>
        <div className="content-item">隐藏要素</div>
        <div className="content-item">全成就指南</div>
      </div>
    </div>
  );
};

export default SectionAlbum;

