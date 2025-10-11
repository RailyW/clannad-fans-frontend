import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import './style.less';

const MusicPlayer = ({
                       currentSong,
                       isPlaying,
                       currentTime,
                       duration,
                       volume,
                       currentAlbum,
                       currentFormat,
                       albums,
                       onPlayPause,
                       onPrevious,
                       onNext,
                       onProgressClick,
                       onProgressMouseDown,
                       onVolumeClick,
                       onVolumeMouseDown,
                       onAlbumChange,
                       onFormatChange,
                       formatTime,
                       progressBarRef,
                       volumeBarRef,
                     }) => {
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(rotation);

  // 当播放状态改变时更新旋转角度
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now();
      const startRotation = rotationRef.current;

      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setRotation((startRotation + elapsed * 18) % 360); // 每秒旋转18度，20秒一圈
      }, 100); // 更频繁的更新以保持流畅

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <motion.div
      className="music-player-container"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 专辑选择器 */}
      <div className="player-settings">
        <div className="setting-group">
          <label>专辑</label>
          <select value={currentAlbum} onChange={(e) => onAlbumChange(e.target.value)} className="album-selector">
            {albums.map(album => (
              <option key={album.value} value={album.value}>{album.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 专辑封面 */}
      <motion.div
        className="album-cover-wrapper"
        animate={{
          rotate: isPlaying ? rotation + 360 : rotation,
          scale: isPlaying ? 1.05 : 1
        }}
        transition={{
          rotate: isPlaying ? { duration: 20, repeat: Infinity, ease: "linear" } : { duration: 0 },
          scale: { duration: 0.3 }
        }}
      >
        <div className="album-cover">
          <div className="album-vinyl" />
          <motion.div
            className="album-image"
            key={currentSong.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {currentSong.cover ? (
              <img src={currentSong.cover} alt={currentSong.title} />
            ) : (
              <div className="placeholder-cover">♪</div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* 歌曲信息 */}
      <AnimatePresence mode="wait">
        <motion.div
          className="song-info"
          key={currentSong.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="song-title">{currentSong.title}</h2>
          <p className="song-artist">{currentSong.artist}</p>
          <p className="song-album">{currentSong.album}</p>
        </motion.div>
      </AnimatePresence>

      {/* 进度条 */}
      <div className="progress-section">
        <span className="time-display">{formatTime(currentTime)}</span>
        <div
          ref={progressBarRef}
          className="progress-bar"
          onClick={onProgressClick}
          onMouseDown={onProgressMouseDown}
        >
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(currentTime / duration) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      {/* 控制按钮 */}
      <div className="controls">
        <motion.button
          className="control-btn format-btn"
          onClick={() => onFormatChange(currentFormat === 'mp3' ? 'flac' : 'mp3')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={currentFormat === 'mp3' ? '切换到无损' : '切换到MP3'}
        >
          <span className="format-text">{currentFormat.toUpperCase()}</span>
        </motion.button>

        <motion.button
          className="control-btn"
          onClick={onPrevious}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <StepBackwardOutlined />
        </motion.button>

        <motion.button
          className="control-btn play-btn"
          onClick={onPlayPause}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        </motion.button>

        <motion.button
          className="control-btn"
          onClick={onNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <StepForwardOutlined />
        </motion.button>
      </div>

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
    </motion.div>
  );
};

export default MusicPlayer;
