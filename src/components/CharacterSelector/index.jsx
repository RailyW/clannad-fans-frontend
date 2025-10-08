import { useRef, useEffect, useState } from 'react';
import './style.less';

const CharacterSelector = ({ onSelect }) => {
  const scrollContainerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const animationRef = useRef(null);

  // 导入所有角色头像
  const characters = [
    { id: 'nagisa', name: '古河渚', avatar: new URL('../../assets/character-avatar/_system_vo_nagisa_ZH.png', import.meta.url).href },
    { id: 'tomoyo', name: '坂上智代', avatar: new URL('../../assets/character-avatar/_system_vo_tomoyo_ZH.png', import.meta.url).href },
    { id: 'kyou', name: '藤林杏', avatar: new URL('../../assets/character-avatar/_system_vo_kyou_ZH.png', import.meta.url).href },
    { id: 'ryou', name: '藤林椋', avatar: new URL('../../assets/character-avatar/_system_vo_ryou_ZH.png', import.meta.url).href },
    { id: 'kotomi', name: '一之濑琴美', avatar: new URL('../../assets/character-avatar/_system_vo_kotomi_ZH.png', import.meta.url).href },
    { id: 'fuko', name: '伊吹风子', avatar: new URL('../../assets/character-avatar/_system_vo_fuko_ZH.png', import.meta.url).href },
    { id: 'yukine', name: '宫泽有纪宁', avatar: new URL('../../assets/character-avatar/_system_vo_yukine_ZH.png', import.meta.url).href },
    { id: 'misae', name: '伊吹公子', avatar: new URL('../../assets/character-avatar/_system_vo_misae_ZH.png', import.meta.url).href },
    { id: 'kouko', name: '古河早苗', avatar: new URL('../../assets/character-avatar/_system_vo_kouko_ZH.png', import.meta.url).href },
    { id: 'sanae', name: '古河早苗', avatar: new URL('../../assets/character-avatar/_system_vo_sanae_ZH.png', import.meta.url).href },
    { id: 'akio', name: '古河秋生', avatar: new URL('../../assets/character-avatar/_system_vo_akio_ZH.png', import.meta.url).href },
    { id: 'sunohara', name: '春原阳平', avatar: new URL('../../assets/character-avatar/_system_vo_sunohara_ZH.png', import.meta.url).href },
    { id: 'mei', name: '春原芽衣', avatar: new URL('../../assets/character-avatar/_system_vo_mei_ZH.png', import.meta.url).href },
    { id: 'ushio', name: '冈崎汐', avatar: new URL('../../assets/character-avatar/_system_vo_ushio_ZH.png', import.meta.url).href },
    { id: 'yoshino', name: '芳野祐介', avatar: new URL('../../assets/character-avatar/_system_vo_yoshino_ZH.png', import.meta.url).href },
    { id: 'koumura', name: '幸村俊夫', avatar: new URL('../../assets/character-avatar/_system_vo_koumura_ZH.png', import.meta.url).href },
    { id: 'botan', name: '牡丹', avatar: new URL('../../assets/character-avatar/_system_vo_botan_ZH.png', import.meta.url).href },
    { id: 'kappei', name: '胜平', avatar: new URL('../../assets/character-avatar/_system_vo_kappei_ZH.png', import.meta.url).href },
    { id: 'naouyuki', name: '直幸', avatar: new URL('../../assets/character-avatar/_system_vo_naouyuki_ZH.png', import.meta.url).href },
    { id: 'sonota', name: '其他', avatar: new URL('../../assets/character-avatar/_system_vo_sonota_ZH.png', import.meta.url).href },
  ];

  // 自动滚动
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationId;

    const animate = () => {
      if (!container) return;

      // 如果正在hover，暂停动画但继续循环
      if (isHovering) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // 每帧滚动固定像素数
      const scrollSpeed = 0.5;

      // 获取当前滚动位置
      let currentScroll = container.scrollLeft;
      currentScroll += scrollSpeed;

      // 计算一半宽度（因为我们复制了一次列表）
      const maxScroll = container.scrollWidth / 2;

      // 当滚动超过一半时，重置到开始位置实现无缝循环
      if (currentScroll >= maxScroll) {
        currentScroll = 0;
      }

      container.scrollLeft = currentScroll;
      animationId = requestAnimationFrame(animate);
    };

    // 确保容器加载完成后再开始动画
    const timer = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isHovering]);

  // 处理鼠标滚轮 - 阻止事件冒泡
  const handleWheel = (e) => {
    e.stopPropagation(); // 阻止事件冒泡到父元素
    if (!isHovering) return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollLeft += e.deltaY * 2;
    }
  };

  const handleCharacterClick = (character) => {
    if (onSelect) {
      onSelect(character);
    }
  };

  // 复制角色列表以实现无限循环效果
  const duplicatedCharacters = [...characters, ...characters];

  return (
    <div className="character-selector">
      <div
        className="selector-container"
        ref={scrollContainerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setHoveredIndex(null);
        }}
        onWheel={handleWheel}
      >
        <div className="characters-list">
          {duplicatedCharacters.map((character, index) => (
            <div
              key={`${character.id}-${index}`}
              className={`character-item ${hoveredIndex === index ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleCharacterClick(character)}
            >
              <div className="character-avatar">
                <img src={character.avatar} alt={character.name} />
              </div>
              <div className="character-name">{character.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterSelector;
