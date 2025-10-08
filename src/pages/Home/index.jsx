import { useEffect, useState, useRef } from 'react';
import './style.less';
import SectionWelcome from "./SectionWelcome.jsx";
import SectionAbout from "./SectionAbout.jsx";

const Home = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);

  const sections = [
    {
      id: 'welcome',
      className: 'top_wrapper',
      content: <SectionWelcome />,
    },
    {
      id: 'about',
      className: 'about_wrapper',
      content: <SectionAbout />,
    },
    {
      id: 'resources',
      className: 'special_wrapper',
      content: (
        <div className="section-content">
          <div className="content-card">
            <h2 className="section-title">游戏资源</h2>
            <div className="card-scrollable-content">
              <p className="section-description">下载游戏相关资源和素材</p>
              <div className="content-placeholder">
                <div className="placeholder-item">游戏本体</div>
                <div className="placeholder-item">音乐下载</div>
                <div className="placeholder-item">CG壁纸</div>
                <div className="placeholder-item">周边资源</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'guide',
      className: 'story_wrapper',
      content: (
        <div className="section-content">
          <div className="content-card">
            <h2 className="section-title">游戏攻略</h2>
            <div className="card-scrollable-content">
              <p className="section-description">完整的游戏流程攻略和成就指南</p>
              <div className="content-placeholder">
                <div className="placeholder-item">主线攻略</div>
                <div className="placeholder-item">支线任务</div>
                <div className="placeholder-item">隐藏要素</div>
                <div className="placeholder-item">全成就指南</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'community',
      className: 'character_wrapper',
      content: (
        <div className="section-content">
          <div className="content-card">
            <h2 className="section-title">社区讨论</h2>
            <div className="card-scrollable-content">
              <p className="section-description">与其他玩家分享你的游戏体验</p>
              <div className="content-placeholder">
                <div className="placeholder-item">热门话题</div>
                <div className="placeholder-item">玩家心得</div>
                <div className="placeholder-item">二次创作</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      className: 'spec_wrapper',
      content: (
        <div className="section-content">
          <div className="content-card">
            <h2 className="section-title">联系我们</h2>
            <div className="card-scrollable-content">
              <p className="section-description">加入我们的社区，与更多玩家交流</p>
              <div className="content-placeholder">
                <div className="placeholder-item">官方QQ群</div>
                <div className="placeholder-item">Discord</div>
                <div className="placeholder-item">邮件联系</div>
              </div>
              <div className="copyright">&copy; CLANNAD Fans Community</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const scrollToSection = (index) => {
    if (index >= 0 && index < sections.length && !isScrolling) {
      setIsScrolling(true);
      setCurrentSection(index);
      setTimeout(() => setIsScrolling(false), 1000);
    }
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling) return;

      // 检查是否在可滚动内容区域内
      const scrollableContent = e.target.closest('.card-scrollable-content');
      if (scrollableContent) {
        // 如果鼠标在卡片内容区域，完全不触发页面切换，让卡片自己处理滚动
        return;
      }

      // 如果不在可滚动区域内，正常处理页面切换
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
  }, [isScrolling, currentSection, sections.length]);

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
  }, [isScrolling, currentSection]);

  return (
    <div className="home-container" ref={containerRef}>
      {/* 固定背景 */}
      <div className="parallax-background"></div>

      {/* 左侧导航菜单 */}
      <div className="left_menu_wrapper">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`left_menu_box ${currentSection === index ? 'active' : ''}`}
            onClick={() => scrollToSection(index)}
          >
            <span className="menu-text">{section.id.toUpperCase()}</span>
          </div>
        ))}
      </div>

      {/* 内容区域 - 使用 transform 进行平滑过渡 */}
      <div
        className="sections-container"
        style={{
          transform: `translateY(-${currentSection * 100}vh)`,
          transition: isScrolling ? 'transform 1s cubic-bezier(0.645, 0.045, 0.355, 1)' : 'none'
        }}
      >
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className={`section ${section.className} js-section`}
          >
            {section.content}
          </section>
        ))}
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
