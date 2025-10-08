import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './SectionCharacter.less';
import CharacterCarousel from '../../components/CharacterCarousel/index.jsx';
import { characters } from './data/CharacterInfo.js';

const SectionCharacter = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState('nagisa');

  // 根据 ID 找到当前选中的角色对象
  const selectedCharacter = characters.find(char => char.id === selectedCharacterId) || characters[0];

  return (
    <div className="section-character">
      {/* 左侧信息区域 */}
      <div className="info-area">
        <div className="character-details">
          <AnimatePresence mode="wait">
            <motion.h2
              key={`name-${selectedCharacter.id}`}
              className="character-name"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {selectedCharacter.name}
            </motion.h2>
          </AnimatePresence>

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

      {/* 右侧立绘区域 */}
      <div className="illustration-area">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedCharacter.id}
            src={selectedCharacter.tachie}
            alt={selectedCharacter.name}
            className="character-illustration"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </AnimatePresence>
      </div>

      {/* 底部头像轮播区域 */}
      <CharacterCarousel
        characters={characters}
        selectedCharacterId={selectedCharacterId}
        onCharacterSelect={setSelectedCharacterId}
      />
    </div>
  );
};

export default SectionCharacter;
