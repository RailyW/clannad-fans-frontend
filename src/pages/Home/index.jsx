import { useEffect, useState, useRef, useCallback } from 'react';
import './style.less';
import SectionWelcome from "./SectionWelcome.jsx";
import SectionAbout from "./SectionAbout.jsx";
import SectionMusic from "./SectionMusic.jsx";
import SectionAlbum from "./SectionAlbum.jsx";
import SectionCharacter from "./SectionCharacter.jsx";
import { pageBackgrounds } from './backgrounds.js';
import TopNavigation from "../../components/TopNavigation/index.jsx";
import IntroOverlay from "../../components/IntroOverlay/index.jsx";

const Home = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [nextSection, setNextSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [backgroundTransitioning, setBackgroundTransitioning] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down'); // 'down' 或 'up'
  const [showIntro, setShowIntro] = useState(true); // 控制开场动画
  const containerRef = useRef(null);

  const sections = [
    { id: '首页', component: <SectionWelcome />, background: pageBackgrounds.welcome },
    { id: '角色', component: <SectionCharacter />, background: pageBackgrounds.community },
    { id: '音乐', component: <SectionMusic />, background: pageBackgrounds.resources },
    { id: '相册', component: <SectionAlbum />, background: pageBackgrounds.guide },
    { id: '关于', component: <SectionAbout />, background: pageBackgrounds.about },
  ];

  const scrollToSection = useCallback((index, direction) => {
    if (index >= 0 && index < sections.length && !isScrolling) {
      setIsScrolling(true);
      setScrollDirection(direction);

      // 立即开始背景和内容同步滚动
      setNextSection(index);
      setBackgroundTransitioning(true);

      // 800ms后完成切换
      setTimeout(() => {
        setCurrentSection(index);
        setBackgroundTransitioning(false);
        setIsScrolling(false);
      }, 800);
    }
  }, [sections.length, isScrolling]);

  const handleNavigate = (index) => {
    const direction = index > currentSection ? 'down' : 'up';
    scrollToSection(index, direction);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling) return;

      e.preventDefault();

      if (e.deltaY > 0) {
        // 向下滚动
        if (currentSection < sections.length - 1) {
          scrollToSection(currentSection + 1, 'down');
        }
      } else {
        // 向上滚动
        if (currentSection > 0) {
          scrollToSection(currentSection - 1, 'up');
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
        scrollToSection(currentSection + 1, 'down');
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSection(currentSection - 1, 'up');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScrolling, currentSection, scrollToSection]);

  return (
    <div className="home-container" ref={containerRef}>
      {/* 开场遮罩动画 */}
      {showIntro && <IntroOverlay onComplete={handleIntroComplete} />}

      {/* 当前背景 */}
      <div
        className={`page-background current ${backgroundTransitioning ? (scrollDirection === 'down' ? 'leaving-up' : 'leaving-down') : ''}`}
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

      {/* 下一个背景 */}
      {backgroundTransitioning && (
        <div
          className={`page-background next ${scrollDirection === 'down' ? 'coming-from-bottom' : 'coming-from-top'}`}
          style={{
            backgroundImage: `url(${sections[nextSection].background.image})`,
          }}
        >
          <div
            className="background-overlay"
            style={{
              background: sections[nextSection].background.overlay
            }}
          ></div>
        </div>
      )}

      {/* 顶部导航菜单 */}
      <TopNavigation
        sections={sections}
        currentSection={currentSection}
        onNavigate={handleNavigate}
      />

      {/* 当前内容 - 跟随背景一起滚动 */}
      <div
        className={`page-wrapper current ${backgroundTransitioning ? (scrollDirection === 'down' ? 'leaving-up' : 'leaving-down') : ''}`}
      >
        {sections[currentSection].component}
      </div>

      {/* 下一个内容 - 跟随背景一起滚动进入 */}
      {backgroundTransitioning && (
        <div
          className={`page-wrapper next ${scrollDirection === 'down' ? 'coming-from-bottom' : 'coming-from-top'}`}
        >
          {sections[nextSection].component}
        </div>
      )}

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
