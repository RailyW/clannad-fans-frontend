import GameLogo from "../GameLogo/index.jsx";
import './style.less';

const TopNavigation = ({ sections, currentSection, onNavigate }) => {
  const handleNavigate = (index) => {
    // 如果点击的是当前页面，不触发导航
    if (index === currentSection) {
      return;
    }
    onNavigate(index);
  };

  return (
    <nav className="top-navigation">
      <div className="logo-container">
        <GameLogo />
      </div>
      {/*
      <div className="nav-menu">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`nav-menu-item ${currentSection === index ? 'active' : ''}`}
            onClick={() => handleNavigate(index)}
          >
            <span className="menu-text">{section.id}</span>
          </div>
        ))}
      </div>
      */}
    </nav>
  );
};

export default TopNavigation;
