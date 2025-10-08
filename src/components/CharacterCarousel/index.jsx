import { useRef, useEffect } from 'react';
import './style.less';

const CharacterCarousel = ({ characters, selectedCharacterId, onCharacterSelect }) => {
  const carouselRef = useRef(null);

  // 阻止轮播区域的滚轮事件冒泡
  useEffect(() => {
    const carouselContainer = carouselRef.current;

    const handleWheel = (e) => {
      const carousel = e.currentTarget.querySelector('.avatar-carousel');
      if (!carousel) return;

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
    onCharacterSelect(character.id);
  };

  return (
    <div className="avatar-carousel-container" ref={carouselRef}>
      <div className="avatar-carousel">
        {characters.map((character) => (
          <div
            key={character.id}
            className={`avatar-item ${character.id === selectedCharacterId ? 'active' : ''}`}
            onClick={() => handleCharacterClick(character)}
            title={character.name}
          >
            <img src={character.avatar} alt={character.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterCarousel;

