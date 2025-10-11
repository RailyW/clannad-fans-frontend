import { motion as Motion } from 'motion/react';
import { useRef, useEffect } from 'react';
import './style.less';

const PlaylistPanel = ({
                         playlist,
                         currentTrack,
                         isPlaying,
                         onSelectTrack,
                         isFirstVisit = true,
                         isActive = false,
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
    <Motion.div
      className="playlist-panel"
      initial={{ opacity: 0, x: 50 }}
      animate={
        isActive && isFirstVisit
          ? { opacity: 1, x: 0 }
          : isActive
          ? { opacity: 1, x: 0 }
          : { opacity: 0, x: 50 }
      }
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
    >
      <div className="playlist-header">
        <h3>播放列表</h3>
        <div className="playlist-count">{playlist.length} 首歌曲</div>
      </div>
      <div className="playlist-items" ref={playlistItemsRef}>
        {playlist.map((track, index) => (
          <Motion.div
            key={track.id}
            className={`playlist-item ${index === currentTrack ? 'active' : ''}`}
            onClick={() => onSelectTrack(index)}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={
              isActive && isFirstVisit
                ? { opacity: 1, y: 0 }
                : isActive
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ delay: isActive && isFirstVisit ? 0.3 + index * 0.05 : 0 }}
          >
            <div className="track-number">{index + 1}</div>
            <div className="track-info">
              <div className="track-title">{track.title}</div>
            </div>
            <div className="track-artist">{track.artist}</div>
            {index === currentTrack && isPlaying && (
              <Motion.div
                className="playing-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Motion.span
                  animate={{ scaleY: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <Motion.span
                  animate={{ scaleY: [1, 0.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <Motion.span
                  animate={{ scaleY: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
              </Motion.div>
            )}
          </Motion.div>
        ))}
      </div>
    </Motion.div>
  );
};

export default PlaylistPanel;
