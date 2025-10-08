import { useEffect, useState } from 'react';
import './SectionWelcome.less';

const COLUMN_TEXTS = [
  '如果您愿意的话，',
  '让我带您去吧，',
  '这座小镇愿望实现的地方...'
];

// 模块级变量，记录是否已经播放过动画
let hasAnimated = false;

const SectionWelcome = () => {
  const [showClass, setShowClass] = useState('');

  useEffect(() => {
    // 首次加载时触发动画
    if (!hasAnimated) {
      // 等待开场动画完成后再显示（假设开场动画大约需要 2-3 秒）
      setTimeout(() => setShowClass('show'), 2500);
      hasAnimated = true;
    } else {
      // 后续加载，直接显示
      setShowClass('instant');
    }
  }, []);

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
