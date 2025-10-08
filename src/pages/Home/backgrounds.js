// 每个页面的背景配置
import homeBackground from '../../assets/home-bg.png';
import aboutBackground from '../../assets/about-bg.png';
import characterBackground from '../../assets/character-bg.jpg';
import albumBackground from '../../assets/album-bg.png';
import musicBackground from '../../assets/music-bg.jpg';

export const pageBackgrounds = {
  welcome: {
    image: homeBackground,
    overlay: 'rgba(0, 0, 0, 0)'
  },
  character: {
    image: characterBackground,
    overlay: 'rgba(0, 0, 0, 0.2)'
  },
  music: {
    image: musicBackground,
    overlay: 'rgba(0, 0, 0, 0.2)'
  },
  album: {
    image: albumBackground,
    overlay: 'rgba(0, 0, 0, 0.2)'
  },
  about: {
    image: aboutBackground,
    overlay: 'rgba(0, 0, 0, 0.2)'
  },
};
