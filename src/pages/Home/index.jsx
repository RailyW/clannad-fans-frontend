import { useEffect, useState, useRef } from 'react';
import './style.less';

const Home = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionsRef = useRef(null);

  const sections = [
    {
      id: 'welcome',
      title: 'CLANNAD Fans Community',
      subtitle: '欢迎来到CLANNAD粉丝社区',
      hint: '↓ 滚动鼠标探索更多 ↓',
      type: 'welcome'
    },
    {
      id: 'intro',
      title: '游戏介绍',
      description: 'CLANNAD是Key社制作的经典视觉小说游戏',
      items: ['故事背景', '角色介绍', '游戏特色']
    },
    {
      id: 'resources',
      title: '游戏资源',
      description: '下载游戏相关资源和素材',
      items: ['游戏本体', '音乐下载', 'CG壁纸', '周边资源']
    },
    {
      id: 'guide',
      title: '游戏攻略',
      description: '完整的游戏流程攻略和成就指南',
      items: ['主线攻略', '支线任务', '隐藏要素', '全成就指南']
    },
    {
      id: 'community',
      title: '社区讨论',
      description: '与其他玩家分享你的游戏体验',
      items: ['热门话题', '玩家心得', '二次创作']
    },
    {
      id: 'contact',
      title: '联系我们',
      description: '加入我们的社区，与更多玩家交流',
      items: ['官方QQ群', 'Discord', '邮件联系']
    }
  ];

  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling) return;

      e.preventDefault();
      setIsScrolling(true);

      if (e.deltaY > 0) {
        // 向下滚动
        setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
      } else {
        // 向上滚动
        setCurrentSection((prev) => Math.max(prev - 1, 0));
      }

      setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    };

    const container = sectionsRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isScrolling, sections.length]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isScrolling) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        setIsScrolling(true);
        setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
        setTimeout(() => setIsScrolling(false), 800);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        setIsScrolling(true);
        setCurrentSection((prev) => Math.max(prev - 1, 0));
        setTimeout(() => setIsScrolling(false), 800);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScrolling, sections.length]);

  return (
    <div className="home-container" ref={sectionsRef}>
      {/* 固定背景 */}
      <div className="parallax-background"></div>

      {/* 导航指示器 */}
      <div className="section-indicators">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`indicator ${currentSection === index ? 'active' : ''}`}
            onClick={() => {
              if (!isScrolling) {
                setIsScrolling(true);
                setCurrentSection(index);
                setTimeout(() => setIsScrolling(false), 800);
              }
            }}
          />
        ))}
      </div>

      {/* 内容区域 */}
      <div className="content-container">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`content-section ${section.type || ''} ${
              currentSection === index ? 'active' : ''
            }`}
          >
            <div className="section-content">
              {section.type === 'welcome' ? (
                <>
                  <h1 className="main-title">{section.title}</h1>
                  <p className="subtitle">{section.subtitle}</p>
                  <div className="scroll-hint">{section.hint}</div>
                </>
              ) : (
                <>
                  <h2 className="section-title">{section.title}</h2>
                  <p className="section-description">{section.description}</p>
                  <div className="content-placeholder">
                    {section.items.map((item, idx) => (
                      <div key={idx} className="placeholder-item">
                        {item}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
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
