import GameLogo from "../GameLogo/index.jsx";
import './style.less';

const TopNavigation = ({ sections, currentSection, onNavigate }) => {
  return (
    <nav className="top-navigation">
      <div className="logo-container">
        <GameLogo />
      </div>
      <div className="nav-menu">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`nav-menu-item ${currentSection === index ? 'active' : ''}`}
            onClick={() => onNavigate(index)}
          >
            <span className="menu-text">{section.id}</span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default TopNavigation;

