import { useEffect } from 'react';
import { motion } from 'motion/react';
import GameLogo from '../GameLogo/index.jsx';
import './style.less';

const IntroOverlay = ({ onComplete }) => {
  useEffect(() => {
    // 3秒后完全消失，通知父组件
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="intro-overlay"
      initial={{ backgroundColor: 'rgba(0, 0, 0, 1)', opacity: 1 }}
      animate={{
        backgroundColor: [
          'rgba(0, 0, 0, 1)',      // 0-1s: 黑色
          'rgba(0, 0, 0, 1)',      // 1s: 黑色保持
          'rgba(255, 255, 255, 1)', // 1-2s: 变白色
          'rgba(255, 255, 255, 1)', // 2s: 白色保持
        ],
        opacity: [1, 1, 1, 0], // 2-3s 最后1秒淡出
        pointerEvents: ['auto', 'auto', 'auto', 'none'] // 2秒后禁用交互阻挡
      }}
      transition={{
        duration: 3,
        times: [0, 0.33, 0.66, 1], // 0s, 1s, 2s, 3s
        ease: 'easeInOut'
      }}
    >
      <div className="intro-logo">
        <GameLogo />
      </div>
    </motion.div>
  );
};

export default IntroOverlay;
