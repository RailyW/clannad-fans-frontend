import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './style.less';
import SectionWelcome from "./sections/welcome/SectionWelcome.jsx";
// import SectionAbout from "./sections/about/SectionAbout.jsx";
// import SectionAlbum from "./sections/album/SectionAlbum.jsx";
import SectionCharacter from "./sections/character/SectionCharacter.jsx";
import { pageBackgrounds } from './data/HomeBackground.js';
import TopNavigation from "../../components/TopNavigation/index.jsx";
import IntroOverlay from "../../components/IntroOverlay/index.jsx";

const Home = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down'); // 'down' 或 'up'
  const [showIntro, setShowIntro] = useState(true); // 控制开场动画
  const containerRef = useRef(null);

  const sections = useMemo(() => [
    { id: '首页', component: <SectionWelcome showIntro={showIntro} />, background: pageBackgrounds.welcome },
    { id: '角色', component: <SectionCharacter />, background: pageBackgrounds.character },
    // { id: '相册', component: <SectionAlbum />, background: pageBackgrounds.album },
    // { id: '关于', component: <SectionAbout />, background: pageBackgrounds.about },
  ], [showIntro]);

  // 背景切换动画变体
  const backgroundVariants = {
    enter: (direction) => ({
      y: direction === 'down' ? '100%' : '-100%',
    }),
    center: {
      y: 0,
    },
    exit: (direction) => ({
      y: direction === 'down' ? '-100%' : '100%',
    }),
  };

  // Section 内容切换动画变体
  const sectionVariants = {
    enter: (direction) => ({
      y: direction === 'down' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      y: direction === 'down' ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  // 动画过渡配置
  const transition = {
    type: 'tween',
    ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier
    duration: 0.8,
  };

  const scrollToSection = useCallback((index, direction) => {
    if (index >= 0 && index < sections.length && !isScrolling) {
      setIsScrolling(true);
      setScrollDirection(direction);
      setCurrentSection(index);

      // 800ms后解除滚动锁定
      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    }
  }, [isScrolling, sections.length]);

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

      {/* 背景层 - 使用 AnimatePresence 和 Motion */}
      <AnimatePresence initial={false} custom={scrollDirection}>
        <motion.div
          key={`bg-${currentSection}`}
          className="page-background"
          style={{
            backgroundImage: `url(${sections[currentSection].background.image})`,
          }}
          custom={scrollDirection}
          variants={backgroundVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
        >
          <motion.div
            className="background-overlay"
            style={{
              background: sections[currentSection].background.overlay
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </AnimatePresence>

      {/* 顶部导航菜单 */}
      <TopNavigation
        sections={sections}
        currentSection={currentSection}
        onNavigate={handleNavigate}
      />

      {/* Section 内容层 - 渲染所有 section 并保持挂载 */}
      {sections.map((section, index) => {
        // 根据当前位置和滚动方向计算动画状态
        let animateState = "center";
        if (index !== currentSection) {
          // 如果是非当前section，根据位置关系决定动画状态
          if (scrollDirection === 'down') {
            // 向下滚动：已经看过的在上面（exit向上），还没看的在下面（enter从下面来）
            animateState = index < currentSection ? "exit" : "enter";
          } else {
            // 向上滚动：已经看过的在下面（exit向下），还没看的在上面（enter从上面来）
            animateState = index > currentSection ? "exit" : "enter";
          }
        }

        return (
          <motion.div
            key={`section-${section.id}`}
            className="page-wrapper"
            custom={scrollDirection}
            variants={sectionVariants}
            initial={false}
            animate={animateState}
            transition={transition}
            style={{
              pointerEvents: index === currentSection ? 'auto' : 'none',
              zIndex: index === currentSection ? 1 : 0,
            }}
          >
            {section.component}
          </motion.div>
        );
      })}
    </div>
  );
};

export default Home;
