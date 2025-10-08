import { useEffect, useState } from 'react';
import GameLogo from '../GameLogo/index.jsx';
import './style.less';

const IntroOverlay = ({ onComplete }) => {
  const [stage, setStage] = useState('black'); // 'black' -> 'white' -> 'fade-out'

  useEffect(() => {
    // 1秒后变为白色
    const timer1 = setTimeout(() => {
      setStage('white');
    }, 1000);

    // 2秒后开始淡出
    const timer2 = setTimeout(() => {
      setStage('fade-out');
    }, 2000);

    // 3秒后完全消失，通知父组件
    const timer3 = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className={`intro-overlay ${stage}`}>
      <div className="intro-logo">
        <GameLogo />
      </div>
    </div>
  );
};

export default IntroOverlay;
