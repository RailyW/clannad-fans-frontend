import { motion } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

const AlbumCover = ({ song, isPlaying, isLoading }) => {
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(rotation);

  // 当播放状态改变时更新旋转角度
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    if (isPlaying && !isLoading) {
      const startTime = Date.now();
      const startRotation = rotationRef.current;

      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setRotation((startRotation + elapsed * 18) % 360); // 每秒旋转18度，20秒一圈
      }, 100); // 更频繁的更新以保持流畅

      return () => clearInterval(interval);
    }
  }, [isPlaying, isLoading]);

  return (
    <motion.div
      className="album-cover-wrapper"
      animate={{
        rotate: (isPlaying && !isLoading) ? rotation + 360 : rotation,
        scale: (isPlaying && !isLoading) ? 1.05 : 1
      }}
      transition={{
        rotate: (isPlaying && !isLoading) ? { duration: 20, repeat: Infinity, ease: "linear" } : { duration: 0 },
        scale: { duration: 0.3 }
      }}
    >
      <div className="album-cover">
        <div className="album-vinyl" />
        <motion.div
          className="album-image"
          key={song.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {song.cover ? (
            <img src={song.cover} alt={song.title} />
          ) : (
            <div className="placeholder-cover">♪</div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AlbumCover;

