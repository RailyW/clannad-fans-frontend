import { motion } from 'motion/react';

const ProgressBar = ({
  currentTime,
  duration,
  progressBarRef,
  onProgressClick,
  onProgressMouseDown,
  formatTime,
  isDragging,
  tempProgress
}) => {
  const displayTime = isDragging ? tempProgress : currentTime;
  const progressPercent = ((displayTime / duration) * 100) || 0;

  return (
    <div className="progress-section">
      <span className="time-display">{formatTime(displayTime)}</span>
      <div
        ref={progressBarRef}
        className="progress-bar"
        onClick={onProgressClick}
        onMouseDown={onProgressMouseDown}
      >
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <span className="time-display">{formatTime(duration)}</span>
    </div>
  );
};

export default ProgressBar;

