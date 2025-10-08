import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
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
  const [currentOverlay, setCurrentOverlay] = useState(pageBackgrounds.welcome.overlay); // 保存当前 overlay
  const containerRef = useRef(null);

  const sections = useMemo(() => [
    { id: '首页', component: <SectionWelcome />, background: pageBackgrounds.welcome },
    { id: '角色', component: <SectionCharacter />, background: pageBackgrounds.character },
    { id: '音乐', component: <SectionMusic />, background: pageBackgrounds.music },
    { id: '相册', component: <SectionAlbum />, background: pageBackgrounds.album },
    { id: '关于', component: <SectionAbout />, background: pageBackgrounds.about },
  ], []);

  const scrollToSection = useCallback((index, direction) => {
    if (index >= 0 && index < sections.length && !isScrolling) {
      setIsScrolling(true);
      setScrollDirection(direction);

      // 立即开始背景和内容同步滚动
      setNextSection(index);
      setBackgroundTransitioning(true);

      // 同时开始 overlay 过渡
      setCurrentOverlay(sections[index].background.overlay);

      // 800ms后完成切换
      setTimeout(() => {
        setCurrentSection(index);
        setBackgroundTransitioning(false);
        setIsScrolling(false);
      }, 800);
    }
  }, [isScrolling, sections]);

  const handleNavigate = (index) => {
    const direction = index > currentSection ? 'down' : 'up';
    scrollToSection(index, direction);
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
      <IntroOverlay />

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
            background: currentOverlay
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

      {/* 渲染所有 section，使用 CSS 控制显示和动画 */}
      {sections.map((section, index) => {
        let className = 'page-wrapper';

        if (index === currentSection && !backgroundTransitioning) {
          // 当前显示的section
          className += ' active';
        } else if (index === currentSection && backgroundTransitioning) {
          // 正在离开的section
          className += ' current ' + (scrollDirection === 'down' ? 'leaving-up' : 'leaving-down');
        } else if (index === nextSection && backgroundTransitioning) {
          // 正在进入的section
          className += ' next ' + (scrollDirection === 'down' ? 'coming-from-bottom' : 'coming-from-top');
        } else {
          // 其他隐藏的section
          className += ' hidden';
        }

        return (
          <div key={section.id} className={className}>
            {section.component}
          </div>
        );
      })}

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
