import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './SectionCharacter.less';
import CharacterCarousel from '../../components/CharacterCarousel/index.jsx';
import CharacterCard from '../../components/CharacterCard/index.jsx';
import TypewriterText from '../../components/TypewriterText/index.jsx';
import { characters } from './data/CharacterInfo.js';

const SectionCharacter = () => {
  // 状态现在可以安全地保存在组件内部，因为组件不会被卸载
  const [selectedCharacterId, setSelectedCharacterId] = useState('nagisa');
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 800); // 等待 section 切换动画完成（0.8s）

    return () => clearTimeout(timer);
  }, []);

  // 根据 ID 找到当前选中的角色对象
  const selectedCharacter = characters.find(char => char.id === selectedCharacterId) || characters[0];

  return (
    <div className="section-character">
      {/* 上方内容区域 */}
      <div className="content-wrapper">
        {/* macOS 风格悬浮窗口 */}
        <div className="character-window">
          {/* 左侧信息区域 */}
          <div className="info-area">
            <div className="character-details">
              <h2 className="character-name">
                <TypewriterText
                  text={selectedCharacter.name}
                  speed={0.08}
                  deleteSpeed={0.05}
                />
              </h2>

              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${selectedCharacter.id}`}
                  className="character-description"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  {selectedCharacter.description}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* 右侧立绘区域 - 使用卡片组件 */}
          <div className="illustration-area">
            <AnimatePresence mode="wait">
              {showCard && <CharacterCard key={selectedCharacterId} character={selectedCharacter} />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 底部头像轮播区域 */}
      <div className="carousel-wrapper">
        <CharacterCarousel
          characters={characters}
          selectedCharacterId={selectedCharacterId}
          onCharacterSelect={setSelectedCharacterId}
        />
      </div>
    </div>
  );
};

export default SectionCharacter;
