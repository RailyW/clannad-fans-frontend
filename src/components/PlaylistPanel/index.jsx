import { motion } from 'motion/react';
import { useRef, useEffect } from 'react';
import './style.less';

const PlaylistPanel = ({
                         playlist,
                         currentTrack,
                         isPlaying,
                         onSelectTrack,
                         formatTime,
                       }) => {
  const playlistItemsRef = useRef(null);

  // 阻止滚轮事件冒泡到父元素，避免触发section切换
  useEffect(() => {
    const handleWheel = (e) => {
      e.stopPropagation();
    };

    const element = playlistItemsRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <motion.div
      className="playlist-panel"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
    >
      <div className="playlist-header">
        <h3>播放列表</h3>
        <div className="playlist-count">{playlist.length} 首歌曲</div>
      </div>
      <div className="playlist-items" ref={playlistItemsRef}>
        {playlist.map((track, index) => (
          <motion.div
            key={track.id}
            className={`playlist-item ${index === currentTrack ? 'active' : ''}`}
            onClick={() => onSelectTrack(index)}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <div className="track-number">{index + 1}</div>
            <div className="track-info">
              <div className="track-title">{track.title}</div>
            </div>
            <div className="track-artist">{track.artist}</div>
            {index === currentTrack && isPlaying && (
              <motion.div
                className="playing-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.span
                  animate={{ scaleY: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.span
                  animate={{ scaleY: [1, 0.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.span
                  animate={{ scaleY: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PlaylistPanel;
