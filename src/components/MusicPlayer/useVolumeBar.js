import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * 音量条拖动 Hook
 */
const useVolumeBar = ({ onVolumeChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const volumeBarRef = useRef(null);

  // 点击音量条
  const handleClick = useCallback((e) => {
    if (volumeBarRef.current && !isDragging) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onVolumeChange(Math.round(percent * 100));
    }
  }, [isDragging, onVolumeChange]);

  // 开始拖动
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    handleClick(e);
  }, [handleClick]);

  // 拖动中
  const handleMouseMove = useCallback((e) => {
    if (isDragging && volumeBarRef.current) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onVolumeChange(Math.round(percent * 100));
    }
  }, [isDragging, onVolumeChange]);

  // 拖动结束
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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
    volumeBarRef,
    handleClick,
    handleMouseDown
  };
};

export default useVolumeBar;

