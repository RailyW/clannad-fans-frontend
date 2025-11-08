import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * 音频播放器 Hook
 * 封装所有音频播放相关的状态管理和事件处理
 */
const useAudioPlayer = ({
  playlist,
  currentTrack,
  onTrackEnd
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240);
  const [volume, setVolume] = useState(70);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const audioRef = useRef(null);
  const loadingTimeoutRef = useRef(null);
  const loadingStartTimeRef = useRef(0);
  const isLoadingVisibleRef = useRef(false);
  const playPauseDebounceRef = useRef(null);
  const onTrackEndRef = useRef(onTrackEnd);

  // 更新 onTrackEnd ref
  useEffect(() => {
    onTrackEndRef.current = onTrackEnd;
  }, [onTrackEnd]);

  // 隐藏 loading 的辅助函数
  const hideLoading = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    setIsAudioLoading(false);
    isLoadingVisibleRef.current = false;
  }, []);

  // 显示 loading（延迟）
  const showLoadingDelayed = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    loadingTimeoutRef.current = setTimeout(() => {
      setIsAudioLoading(true);
      loadingStartTimeRef.current = Date.now();
      isLoadingVisibleRef.current = true;
    }, 200);
  }, []);

  // 确保最小显示时间后隐藏 loading
  const hideLoadingWithMinTime = useCallback(() => {
    if (!isLoadingVisibleRef.current) {
      hideLoading();
      return;
    }

    const loadingDuration = Date.now() - loadingStartTimeRef.current;
    const minDisplayTime = 300;

    if (loadingDuration < minDisplayTime) {
      setTimeout(hideLoading, minDisplayTime - loadingDuration);
    } else {
      hideLoading();
    }
  }, [hideLoading]);

  // 初始化音频元素和事件监听
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();

      // 音频加载开始
      audioRef.current.addEventListener('loadstart', showLoadingDelayed);

      // 音频可以播放
      audioRef.current.addEventListener('canplay', hideLoadingWithMinTime);

      // 元数据加载完成
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });

      // 可以流畅播放
      audioRef.current.addEventListener('canplaythrough', hideLoadingWithMinTime);

      // 时间更新
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });

      // 播放结束
      audioRef.current.addEventListener('ended', () => {
        if (onTrackEndRef.current) {
          onTrackEndRef.current();
        }
      });

      // 播放错误
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        hideLoading();
      });

      // 等待数据
      audioRef.current.addEventListener('waiting', showLoadingDelayed);

      // 开始播放
      audioRef.current.addEventListener('playing', hideLoadingWithMinTime);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (playPauseDebounceRef.current) {
        clearTimeout(playPauseDebounceRef.current);
      }
    };
  }, [showLoadingDelayed, hideLoadingWithMinTime, hideLoading]);

  // 更新音频源
  useEffect(() => {
    if (audioRef.current && playlist[currentTrack]?.url) {
      const currentSong = playlist[currentTrack];
      audioRef.current.src = currentSong.url;
      audioRef.current.volume = volume / 100;
      audioRef.current.currentTime = 0;
      setCurrentTime(0);

      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Play failed:', err);
          setIsPlaying(false);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, playlist]);

  // 更新播放状态
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Play failed:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // 更新音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // 播放/暂停（带防抖）
  const togglePlay = useCallback(() => {
    if (playPauseDebounceRef.current) {
      return;
    }

    setIsPlaying((prev) => !prev);

    playPauseDebounceRef.current = setTimeout(() => {
      playPauseDebounceRef.current = null;
    }, 300);
  }, []);

  // 跳转到指定时间
  const seekTo = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // 设置音量
  const setVolumeValue = useCallback((value) => {
    setVolume(Math.max(0, Math.min(100, value)));
  }, []);

  return {
    // 状态
    isPlaying,
    currentTime,
    duration,
    volume,
    isAudioLoading,

    // 控制方法
    togglePlay,
    seekTo,
    setVolume: setVolumeValue,
    setIsPlaying,

    // Refs
    audioRef
  };
};

export default useAudioPlayer;

