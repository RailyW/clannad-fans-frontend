import { motion } from 'motion/react';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

const PlayerControls = ({
  isPlaying,
  isLoading,
  onPlayPause,
  onPrevious,
  onNext
}) => {
  return (
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
        className={`control-btn play-btn ${isLoading ? 'loading' : ''}`}
        onClick={onPlayPause}
        whileHover={{ scale: isLoading ? 1 : 1.1 }}
        whileTap={{ scale: isLoading ? 1 : 0.9 }}
        disabled={isLoading}
      >
        {isLoading ? (
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
  );
};

export default PlayerControls;

