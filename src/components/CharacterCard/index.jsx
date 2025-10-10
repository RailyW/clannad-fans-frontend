import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import './style.less';

const CharacterCard = ({ character }) => {
  const cardRef = useRef(null);

  // 鼠标位置的 motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 使用弹簧效果让倾斜更平滑
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  // 处理鼠标移动
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 计算鼠标相对于卡片中心的位置（归一化到 -0.5 到 0.5）
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
  };

  // 处理鼠标离开
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // 卡片动画变体
  const cardVariants = {
    initial: {
      y: 700,
      rotateZ: -10,
      scale: 0.85,
      opacity: 0,
    },
    exit: {
      y: 380,
      rotateZ: 8,
      scale: 0.88,
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 220,
        damping: 20,
        duration: 0.35,
      },
    },
    enter: {
      y: 0,
      rotateZ: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 14,
        bounce: 0.5,
        mass: 1.1,
        duration: 0.8,
      },
    },
  };

  return (
    <div className="character-card-container">
      {/* 卡片 */}
      <motion.div
        ref={cardRef}
        key={character.id}
        className="character-card"
        variants={cardVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="card-content">
          <img
            src={character.tachie}
            alt={character.name}
            className="character-tachie"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default CharacterCard;
