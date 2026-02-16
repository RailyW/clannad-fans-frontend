import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import './SectionWelcome.less';
import SnowEffect from '../../../../components/SnowEffect/index.jsx';

const COLUMN_TEXTS = [
  '让我带你去吧，',
  '这座小镇，',
  '实现愿望的地方。'
];

// 模块级变量，记录是否已经播放过动画
let hasAnimated = false;

const SectionWelcome = ({ showIntro }) => {
  const [showText, setShowText] = useState(false);
  const [shouldPlayAnimation, setShouldPlayAnimation] = useState(false);

  useEffect(() => {
    // 如果开场动画还在显示，不做任何事
    if (showIntro) {
      setShowText(false);
      return;
    }

    // 开场动画已完成
    if (!hasAnimated) {
      // 首次加载，overlay 消失后再显示文字，并播放动画
      setShouldPlayAnimation(true);
      setShowText(true);
      hasAnimated = true;
    } else {
      // 后续加载，直接显示，不播放动画
      setShouldPlayAnimation(false);
      setShowText(true);
    }
  }, [showIntro]);

  return (
    <div className="section-welcome">
      {/* 下雪特效 */}
      <SnowEffect count={15} />

      <div className="text-columns">
        {COLUMN_TEXTS.map((text, idx) => (
          <motion.div
            key={idx}
            className="column"
            initial={{ opacity: 0, y: 30 }}
            animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={
              shouldPlayAnimation
                ? {
                    duration: 0.8,
                    delay: idx * 0.8, // 逐句显示: 第1句0s开始，第2句0.8s开始，第3句1.6s开始
                    ease: 'easeOut'
                  }
                : { duration: 0 } // 后续切换：立即显示
            }
          >
            {text}
          </motion.div>
        ))}
      </div>
      {/* 右下角的跳转入口区域 */}
      <div className="portal-section">
        <iframe
          src="https://store.steampowered.com/widget/324160/"
          frameBorder="0"
          width="600"
          height="200"
        />
      </div>
    </div>
  );
};

export default SectionWelcome;
