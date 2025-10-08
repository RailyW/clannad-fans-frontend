import { useEffect, useState, useRef, useCallback } from 'react';
import './style.less';
import SectionWelcome from "./SectionWelcome.jsx";
import SectionAbout from "./SectionAbout.jsx";
import SectionResources from "./SectionResources.jsx";
import SectionGuide from "./SectionGuide.jsx";
import SectionCommunity from "./SectionCommunity.jsx";
// import SectionContact from "./SectionContact.jsx";
import { pageBackgrounds } from './backgrounds.js';

const Home = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const containerRef = useRef(null);

  const sections = [
    { id: 'welcome', component: <SectionWelcome />, background: pageBackgrounds.welcome },
    { id: 'about', component: <SectionAbout />, background: pageBackgrounds.about },
    { id: 'resources', component: <SectionResources />, background: pageBackgrounds.resources },
    { id: 'guide', component: <SectionGuide />, background: pageBackgrounds.guide },
    { id: 'community', component: <SectionCommunity />, background: pageBackgrounds.community },
    // { id: 'contact', component: <SectionContact />, background: pageBackgrounds.contact }
  ];

  const scrollToSection = useCallback((index) => {
    if (index >= 0 && index < sections.length && !isScrolling) {
      setIsScrolling(true);

      // 先淡出内容
      setContentVisible(false);

      // 600ms后切换背景和内容
      setTimeout(() => {
        setCurrentSection(index);
        // 再过400ms淡入新内容
        setTimeout(() => {
          setContentVisible(true);
          setIsScrolling(false);
        }, 400);
      }, 600);
    }
  }, [sections.length, isScrolling]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling) return;

      e.preventDefault();

      if (e.deltaY > 0) {
        // 向下滚动
        if (currentSection < sections.length - 1) {
          scrollToSection(currentSection + 1);
        }
      } else {
        // 向上滚动
        if (currentSection > 0) {
          scrollToSection(currentSection - 1);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isScrolling, currentSection, sections.length, scrollToSection]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isScrolling) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToSection(currentSection + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSection(currentSection - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScrolling, currentSection, scrollToSection]);

  return (
    <div className="home-container" ref={containerRef}>
      {/* 动态背景 */}
      <div
        className="page-background"
        style={{
          backgroundImage: `url(${sections[currentSection].background.image})`,
        }}
      >
        <div
          className="background-overlay"
          style={{
            background: sections[currentSection].background.overlay
          }}
        ></div>
      </div>

      {/* 顶部导航菜单 */}
      <nav className="left_menu_wrapper">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`left_menu_box ${currentSection === index ? 'active' : ''}`}
            onClick={() => scrollToSection(index)}
          >
            <span className="menu-text">{section.id.toUpperCase()}</span>
          </div>
        ))}
      </nav>

      {/* 内容区域 */}
      <div
        className={`page-wrapper ${contentVisible ? 'visible' : 'hidden'}`}
      >
        {sections[currentSection].component}
      </div>

      {/* 滚动进度条 */}
      <div className="scroll-progress">
        <div
          className="progress-bar"
          style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Home;
