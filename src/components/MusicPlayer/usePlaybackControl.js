import { useState, useCallback } from 'react';

/**
 * 播放控制 Hook
 * 处理播放、暂停、上一曲、下一曲等控制逻辑
 */
const usePlaybackControl = (playlist, playMode) => {
  const [currentTrack, setCurrentTrack] = useState(0);

  // 上一曲
  const handlePrevious = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  }, [playlist.length]);

  // 手动点击下一曲（根据播放模式）
  const handleNext = useCallback(() => {
    if (playlist.length === 0) return;

    if (playMode === 'random') {
      // 随机播放
      let randomIndex;
      if (playlist.length > 1) {
        do {
          randomIndex = Math.floor(Math.random() * playlist.length);
        } while (randomIndex === currentTrack);
      } else {
        randomIndex = 0;
      }
      setCurrentTrack(randomIndex);
    } else {
      // 列表循环和单曲循环都播放下一首
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    }
  }, [playlist.length, playMode, currentTrack]);

  // 自动播放结束时的处理（根据播放模式）
  const handleAutoNext = useCallback((audioRef, setIsPlaying) => {
    if (playlist.length === 0) return;

    if (playMode === 'single-loop') {
      // 单曲循环：重新播放当前曲目
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setIsPlaying(true);
        audioRef.current.play().catch(err => {
          console.error('Play failed:', err);
          setIsPlaying(false);
        });
      }
    } else if (playMode === 'random') {
      // 随机播放
      let randomIndex;
      if (playlist.length > 1) {
        do {
          randomIndex = Math.floor(Math.random() * playlist.length);
        } while (randomIndex === currentTrack);
      } else {
        randomIndex = 0;
      }
      setCurrentTrack(randomIndex);
    } else {
      // 列表循环
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    }
  }, [playMode, playlist.length, currentTrack]);

  // 选择指定曲目
  const selectTrack = useCallback((index) => {
    setCurrentTrack(index);
  }, []);

  return {
    currentTrack,
    handlePrevious,
    handleNext,
    handleAutoNext,
    selectTrack,
    setCurrentTrack
  };
};

export default usePlaybackControl;

