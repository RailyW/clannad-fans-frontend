import { useRef, useEffect } from 'react';
import './SectionCharacter.less';

// 人物数据配置
const characters = [
  { id: 'nagisa', name: '古河 渚', avatar: new URL('../../assets/character-avatar/_system_vo_nagisa_ZH.png', import.meta.url).href, description: '本作女主角，性格温柔善良' },
  { id: 'kyou', name: '藤林 杏', avatar: new URL('../../assets/character-avatar/_system_vo_kyou_ZH.png', import.meta.url).href, description: '活泼开朗的双胞胎姐姐' },
  { id: 'ryou', name: '藤林 椋', avatar: new URL('../../assets/character-avatar/_system_vo_ryou_ZH.png', import.meta.url).href, description: '温柔内向的双胞胎妹妹' },
  { id: 'kotomi', name: '一之濑 琴美', avatar: new URL('../../assets/character-avatar/_system_vo_kotomi_ZH.png', import.meta.url).href, description: '天才少女，喜欢读书和小提琴' },
  { id: 'tomoyo', name: '坂上 智代', avatar: new URL('../../assets/character-avatar/_system_vo_tomoyo_ZH.png', import.meta.url).href, description: '学生会会长，武艺高强' },
  { id: 'fuko', name: '伊吹 风子', avatar: new URL('../../assets/character-avatar/_system_vo_fuko_ZH.png', import.meta.url).href, description: '喜欢海星的神秘少女' },
  { id: 'yukine', name: '宫泽 有纪宁', avatar: new URL('../../assets/character-avatar/_system_vo_yukine_ZH.png', import.meta.url).href, description: '参考资料室的神秘少女' },
  { id: 'misae', name: '伊吹 公子', avatar: new URL('../../assets/character-avatar/_system_vo_misae_ZH.png', import.meta.url).href, description: '宿舍管理员' },
  { id: 'kouko', name: '春原 阳平', avatar: new URL('../../assets/character-avatar/_system_vo_kouko_ZH.png', import.meta.url).href, description: '主角的好友' },
  { id: 'sunohara', name: '春原 阳平', avatar: new URL('../../assets/character-avatar/_system_vo_sunohara_ZH.png', import.meta.url).href, description: '朋也的损友，搞笑担当' },
  { id: 'akio', name: '古河 秋生', avatar: new URL('../../assets/character-avatar/_system_vo_akio_ZH.png', import.meta.url).href, description: '渚的父亲，面包店老板' },
  { id: 'sanae', name: '古河 早苗', avatar: new URL('../../assets/character-avatar/_system_vo_sanae_ZH.png', import.meta.url).href, description: '渚的母亲，温柔贤惠' },
  { id: 'ushio', name: '冈崎 汐', avatar: new URL('../../assets/character-avatar/_system_vo_ushio_ZH.png', import.meta.url).href, description: 'After Story的关键角色' },
  { id: 'mei', name: '春原 芽衣', avatar: new URL('../../assets/character-avatar/_system_vo_mei_ZH.png', import.meta.url).href, description: '阳平的妹妹' },
  { id: 'botan', name: '牡丹', avatar: new URL('../../assets/character-avatar/_system_vo_botan_ZH.png', import.meta.url).href, description: '杏的宠物野猪' },
  { id: 'yoshino', name: '芳野 祐介', avatar: new URL('../../assets/character-avatar/_system_vo_yoshino_ZH.png', import.meta.url).href, description: '乐队的前成员' },
  { id: 'koumura', name: '幸村 俊夫', avatar: new URL('../../assets/character-avatar/_system_vo_koumura_ZH.png', import.meta.url).href, description: '演剧部顾问老师' },
  { id: 'kappei', name: '加藤', avatar: new URL('../../assets/character-avatar/_system_vo_kappei_ZH.png', import.meta.url).href, description: '同学' },
  { id: 'naoyuki', name: '冈崎 直幸', avatar: new URL('../../assets/character-avatar/_system_vo_naouyuki_ZH.png', import.meta.url).href, description: '朋也的父亲' },
  { id: 'sonota', name: '其他', avatar: new URL('../../assets/character-avatar/_system_vo_sonota_ZH.png', import.meta.url).href, description: '其他角色' },
];

const SectionCharacter = ({ selectedCharacterId, onCharacterChange }) => {
  const carouselRef = useRef(null);

  // 根据 ID 找到当前选中的角色对象
  const selectedCharacter = characters.find(char => char.id === selectedCharacterId) || characters[0];

  // 阻止轮播区域的滚轮事件冒泡
  useEffect(() => {
    const carouselContainer = carouselRef.current;

    const handleWheel = (e) => {
      const carousel = e.currentTarget.querySelector('.avatar-carousel');
      if (!carousel) return;

      const { scrollLeft, scrollWidth, clientWidth } = carousel;
      const isAtStart = scrollLeft === 0;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;

      e.stopPropagation();
      carousel.scrollLeft += e.deltaY;
    };

    if (carouselContainer) {
      carouselContainer.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (carouselContainer) {
        carouselContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const handleCharacterClick = (character) => {
    onCharacterChange(character.id);
  };

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
      <div className="avatar-carousel-container" ref={carouselRef}>
        <div className="avatar-carousel">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`avatar-item ${character.id === selectedCharacter.id ? 'active' : ''}`}
              onClick={() => handleCharacterClick(character)}
              title={character.name}
            >
              <img src={character.avatar} alt={character.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionCharacter;
