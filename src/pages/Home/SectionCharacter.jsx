import './SectionCharacter.less';
import CharacterSelector from '../../components/CharacterSelector';
import { useState } from 'react';

const SectionCharacter = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    console.log('选中角色:', character);
  };

  return (
    <div className="section-character">
      {/* 左侧信息区域 */}
      <div className="info-area">
        <CharacterSelector onSelect={handleCharacterSelect} />
        <div className="character-details">
          {/* 角色详细信息将在这里显示 */}
        </div>
      </div>

      {/* 右侧立绘区域 */}
      <div className="illustration-area"></div>
    </div>
  );
};

export default SectionCharacter;
