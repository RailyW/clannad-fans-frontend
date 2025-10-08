import { motion } from 'motion/react';
import { useMemo } from 'react';
import './style.less';

const SnowEffect = ({ count = 30 }) => {
  // 生成雪花数据
  const snowflakes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      // 随机大小：大颗雪花
      size: Math.random() * 20 + 20,
      // 随机初始位置
      left: Math.random() * 100,
      // 随机延迟，让雪花不是同时出现
      delay: Math.random() * 5,
      // 随机持续时间（飘落速度）
      duration: Math.random() * 10 + 8,
      // 随机水平漂移
      xOffset: (Math.random() - 0.5) * 100,
      // 随机旋转速度
      rotationDuration: Math.random() * 4 + 3,
    }));
  }, [count]);

  return (
    <div className="snow-container">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            width: flake.size,
            height: flake.size,
          }}
          initial={{
            y: -20,
            x: 0,
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            y: '110vh',
            x: flake.xOffset,
            opacity: [0, 1, 1, 0.8, 0],
            rotate: 360,
          }}
          transition={{
            y: {
              duration: flake.duration,
              repeat: Infinity,
              delay: flake.delay,
              ease: 'linear',
            },
            x: {
              duration: flake.duration,
              repeat: Infinity,
              delay: flake.delay,
              ease: 'easeInOut',
            },
            opacity: {
              duration: flake.duration,
              repeat: Infinity,
              delay: flake.delay,
              times: [0, 0.1, 0.8, 0.95, 1],
            },
            rotate: {
              duration: flake.rotationDuration,
              repeat: Infinity,
              delay: flake.delay,
              ease: 'linear',
            },
          }}
        />
      ))}
    </div>
  );
};

export default SnowEffect;
