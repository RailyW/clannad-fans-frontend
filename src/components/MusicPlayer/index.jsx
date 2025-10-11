import { motion, AnimatePresence } from 'motion/react';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  SoundOutlined,
  HeartOutlined,
  HeartFilled
} from '@ant-design/icons';
import './style.less';

const MusicPlayer = ({
                       currentSong,
                       isPlaying,
                       currentTime,
                       duration,
                       volume,
                       isFavorite,
                       onPlayPause,
                       onPrevious,
                       onNext,
                       onProgressChange,
                       onVolumeChange,
                       onFavoriteToggle,
                       formatTime,
                     }) => {
  return (
    <motion.div
      className="music-player-container"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 专辑封面 */}
      <motion.div
        className="album-cover-wrapper"
        animate={{
          rotate: isPlaying ? 360 : 0,
          scale: isPlaying ? 1.05 : 1
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
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
            {/* 这里后续可以放置真实的专辑封面图片 */}
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
          className="progress-bar"
          onClick={onProgressChange}
        >
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${(currentTime / duration) * 100}%` }}
            transition={{ duration: 0.1 }}
          />
          <motion.div
            className="progress-thumb"
            style={{ left: `${(currentTime / duration) * 100}%` }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          />
        </div>
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      {/* 控制按钮 */}
      <div className="controls">
        <motion.button
          className="control-btn favorite-btn"
          onClick={onFavoriteToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isFavorite ? <HeartFilled /> : <HeartOutlined />}
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
          className="volume-bar"
          onClick={onVolumeChange}
        >
          <motion.div
            className="volume-fill"
            animate={{ width: `${volume}%` }}
            transition={{ duration: 0.1 }}
          />
          <motion.div
            className="volume-thumb"
            style={{ left: `${volume}%` }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          />
        </div>
        <span className="volume-display">{volume}%</span>
      </div>
    </motion.div>
  );
};

export default MusicPlayer;
