import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  SoundOutlined,
  AppstoreOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { TbRepeat, TbRepeatOnce, TbArrowsShuffle } from 'react-icons/tb';
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
                       playMode,
                       onPlayPause,
                       onPrevious,
                       onNext,
                       onProgressClick,
                       onProgressMouseDown,
                       onVolumeClick,
                       onVolumeMouseDown,
                       onAlbumChange,
                       onFormatChange,
                       onTogglePlayMode,
                       formatTime,
                       progressBarRef,
                       volumeBarRef,
                       isDraggingProgress,
                       tempProgress,
                       isAudioLoading,
                       isFirstVisit = true,
                       isActive = false,
                     }) => {
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(rotation);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 当播放状态改变时更新旋转角度
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    if (isPlaying && !isAudioLoading) {
      const startTime = Date.now();
      const startRotation = rotationRef.current;

      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setRotation((startRotation + elapsed * 18) % 360); // 每秒旋转18度，20秒一圈
      }, 100); // 更频繁的更新以保持流畅

      return () => clearInterval(interval);
    }
  }, [isPlaying, isAudioLoading]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <motion.div
      className="music-player-container"
      initial={{ opacity: 0, x: -50 }}
      animate={
        isActive && isFirstVisit
          ? { opacity: 1, x: 0 }
          : isActive
          ? { opacity: 1, x: 0 }
          : { opacity: 0, x: -50 }
      }
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 专辑选择器 */}
      <div className="player-settings">
        <div className="setting-group">
          <label>专辑</label>
          <div className="album-selector-wrapper" ref={dropdownRef}>
            <motion.div
              className="custom-select"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AppstoreOutlined className="album-icon" />
              <span className="selected-value">
                {albums.find(a => a.value === currentAlbum)?.label}
              </span>
              <motion.span
                className="dropdown-arrow"
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </motion.div>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="dropdown-menu"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {albums.map((album) => (
                    <div
                      key={album.value}
                      className={`dropdown-item ${currentAlbum === album.value ? 'active' : ''}`}
                      onClick={() => {
                        onAlbumChange(album.value);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className="item-icon">♪</span>
                      <span className="item-text">{album.label}</span>
                      {currentAlbum === album.value && (
                        <motion.span
                          className="check-icon"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 专辑封面 */}
      <motion.div
        className="album-cover-wrapper"
        animate={{
          rotate: (isPlaying && !isAudioLoading) ? rotation + 360 : rotation,
          scale: (isPlaying && !isAudioLoading) ? 1.05 : 1
        }}
        transition={{
          rotate: (isPlaying && !isAudioLoading) ? { duration: 20, repeat: Infinity, ease: "linear" } : { duration: 0 },
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
          <p className="song-album">{albums.find(a => a.value === currentAlbum)?.label || currentSong.album}</p>
        </motion.div>
      </AnimatePresence>

      {/* 进度条 */}
      <div className="progress-section">
        <span className="time-display">{formatTime(isDraggingProgress ? tempProgress : currentTime)}</span>
        <div
          ref={progressBarRef}
          className="progress-bar"
          onClick={onProgressClick}
          onMouseDown={onProgressMouseDown}
        >
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((isDraggingProgress ? tempProgress : currentTime) / duration) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      {/* 控制按钮 */}
      <div className="controls">
        <motion.button
          className="control-btn"
          onClick={onPrevious}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <StepBackwardOutlined />
        </motion.button>

        <motion.button
          className={`control-btn play-btn ${isAudioLoading ? 'loading' : ''}`}
          onClick={onPlayPause}
          whileHover={{ scale: isAudioLoading ? 1 : 1.1 }}
          whileTap={{ scale: isAudioLoading ? 1 : 0.9 }}
          disabled={isAudioLoading}
        >
          {isAudioLoading ? (
            <LoadingOutlined spin />
          ) : isPlaying ? (
            <PauseCircleOutlined />
          ) : (
            <PlayCircleOutlined />
          )}
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

      {/* 音量和格式控制 */}
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
          title={
            playMode === 'list-loop' ? '列表循环' :
            playMode === 'single-loop' ? '单曲循环' :
            '随机播放'
          }
        >
          <span className="play-mode-icon">
            {playMode === 'list-loop' ? <TbRepeat /> :
             playMode === 'single-loop' ? <TbRepeatOnce /> :
             <TbArrowsShuffle />}
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
    </motion.div>
  );
};

export default MusicPlayer;
