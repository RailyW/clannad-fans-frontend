import { motion } from 'motion/react';
import './style.less';

const CharacterCard = ({ character }) => {
  // 卡片动画变体
  const cardVariants = {
    initial: {
      y: 700,
      rotateZ: -10,
      scale: 0.85,
    },
    exit: {
      y: 700,
      rotateZ: -10,
      scale: 0.85,
      transition: {
        type: 'spring',
        stiffness: 250,
        damping: 30,
        duration: 0.4,
      },
    },
    enter: {
      y: 0,
      rotateZ: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 12,
        bounce: 0.6,
        mass: 1.2,
        duration: 1.2,
      },
    },
  };

  return (
    <div className="character-card-container">
      {/* 卡片 */}
      <motion.div
        key={character.id}
        className="character-card"
        variants={cardVariants}
        initial="initial"
        animate="enter"
        exit="exit"
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
