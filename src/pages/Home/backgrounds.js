// 每个页面的背景配置
import backgroundImage from '../../assets/home-bg.jpg';
import homeBackground from '../../assets/home-background.png';

export const pageBackgrounds = {
  welcome: {
    image: backgroundImage,
    overlay: 'rgba(0, 0, 0, 0.3)'
  },
  about: {
    image: homeBackground,
    overlay: 'rgba(0, 0, 0, 0.4)'
  },
  resources: {
    image: backgroundImage,
    overlay: 'rgba(0, 0, 0, 0.5)'
  },
  guide: {
    image: homeBackground,
    overlay: 'rgba(0, 0, 0, 0.45)'
  },
  community: {
    image: backgroundImage,
    overlay: 'rgba(0, 0, 0, 0.4)'
  },
  contact: {
    image: homeBackground,
    overlay: 'rgba(0, 0, 0, 0.35)'
  }
};
