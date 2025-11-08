import { motion } from 'motion/react';
import { SoundOutlined } from '@ant-design/icons';
import { TbRepeat, TbRepeatOnce, TbArrowsShuffle } from 'react-icons/tb';

const VolumeControl = ({
  volume,
  volumeBarRef,
  onVolumeClick,
  onVolumeMouseDown,
  currentFormat,
  onFormatChange,
  playMode,
  onTogglePlayMode
}) => {
  const getPlayModeTitle = () => {
    switch (playMode) {
      case 'list-loop': return '列表循环';
      case 'single-loop': return '单曲循环';
      case 'random': return '随机播放';
      default: return '';
    }
  };

  const getPlayModeIcon = () => {
    switch (playMode) {
      case 'list-loop': return <TbRepeat />;
      case 'single-loop': return <TbRepeatOnce />;
      case 'random': return <TbArrowsShuffle />;
      default: return <TbRepeat />;
    }
  };

  return (
    <div className="volume-format-section">
      {/* 格式切换按钮 */}
      <motion.button
        className="control-btn format-btn"
        onClick={() => onFormatChange(currentFormat === 'mp3' ? 'flac' : 'mp3')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={currentFormat === 'mp3' ? '切换到无损' : '切换到MP3'}
      >
        <span className="format-text">{currentFormat.toUpperCase()}</span>
      </motion.button>

      {/* 播放模式切换按钮 */}
      <motion.button
        className="control-btn play-mode-btn"
        onClick={onTogglePlayMode}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={getPlayModeTitle()}
      >
        <span className="play-mode-icon">
          {getPlayModeIcon()}
        </span>
      </motion.button>

      {/* 音量控制 */}
      <div className="volume-section">
        <SoundOutlined className="volume-icon" />
        <div
          ref={volumeBarRef}
          className="volume-bar"
          onClick={onVolumeClick}
          onMouseDown={onVolumeMouseDown}
        >
          <motion.div
            className="volume-fill"
            animate={{ width: `${volume}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <span className="volume-display">{volume}%</span>
      </div>
    </div>
  );
};

export default VolumeControl;

