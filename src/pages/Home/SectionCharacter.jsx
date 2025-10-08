import { useState } from 'react';
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
          <h2 className="character-name">{selectedCharacter.name}</h2>
          <p className="character-description">{selectedCharacter.description}</p>
        </div>
      </div>

      {/* 右侧立绘区域 */}
      <div className="illustration-area">
        <img
          key={selectedCharacter.id}
          src={selectedCharacter.avatar}
          alt={selectedCharacter.name}
          className="character-illustration"
        />
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
