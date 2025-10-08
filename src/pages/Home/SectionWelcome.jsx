import { useEffect, useState } from 'react';
import './SectionWelcome.less';

const COLUMN_TEXTS = [
  '如果您愿意的话，',
  '让我带您去吧，',
  '这座小镇愿望实现的地方...'
];

// 模块级变量，记录是否已经播放过动画
let hasAnimated = false;

const SectionWelcome = ({ showIntro }) => {
  const [showClass, setShowClass] = useState('');

  useEffect(() => {
    // 如果开场动画还在显示，不做任何事
    if (showIntro) {
      return;
    }

    // 开场动画已完成
    if (!hasAnimated) {
      // 首次加载，稍微延迟后触发动画
      setTimeout(() => setShowClass('show'), 200);
      hasAnimated = true;
    } else {
      // 后续加载，直接显示
      setShowClass('instant');
    }
  }, [showIntro]);

  return (
    <div className={`section-welcome ${showClass}`}>
      <div className="text-columns">
        {COLUMN_TEXTS.map((text, idx) => (
          <div className="column" key={idx}>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWelcome;
