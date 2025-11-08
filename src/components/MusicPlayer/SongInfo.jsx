import { motion, AnimatePresence } from 'motion/react';

const SongInfo = ({ song, albumLabel }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="song-info"
        key={song.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="song-title">{song.title}</h2>
        <p className="song-artist">{song.artist}</p>
        <p className="song-album">{albumLabel || song.album}</p>
      </motion.div>
    </AnimatePresence>
  );
};

export default SongInfo;

