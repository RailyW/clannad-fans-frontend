import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * 进度条拖动 Hook
 */
const useProgressBar = ({ duration, onSeek }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);
  const progressBarRef = useRef(null);

  // 点击进度条
  const handleClick = useCallback((e) => {
    if (progressBarRef.current && !isDragging) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = percent * duration;
      onSeek(newTime);
    }
  }, [isDragging, duration, onSeek]);

  // 开始拖动
  const handleMouseDown = useCallback((e) => {
    if (progressBarRef.current) {
      setIsDragging(true);
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = percent * duration;
      setTempProgress(newTime);
    }
  }, [duration]);

  // 拖动中
  const handleMouseMove = useCallback((e) => {
    if (isDragging && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = percent * duration;
      setTempProgress(newTime);
    }
  }, [isDragging, duration]);

  // 拖动结束
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      onSeek(tempProgress);
      setIsDragging(false);
    }
  }, [isDragging, tempProgress, onSeek]);

  // 监听全局鼠标事件
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    progressBarRef,
    isDragging,
    tempProgress,
    handleClick,
    handleMouseDown
  };
};

export default useProgressBar;

