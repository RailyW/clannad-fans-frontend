import { useState, useRef, useEffect, useCallback } from 'react';
import MusicPlayer from '../../components/MusicPlayer/index.jsx';
import PlaylistPanel from '../../components/PlaylistPanel/index.jsx';
import './style.less';
import './SectionMusic.less';

const SectionMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(240); // 模拟时长（秒）
  const [volume, setVolume] = useState(70);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);

  // 模拟音乐数据（后续可替换为API数据）
  const playlist = [
    {
      id: 1,
      title: '小さなてのひら',
      artist: 'eufonius',
      album: 'CLANNAD Original Soundtrack',
      cover: '/album-cover-1.jpg',
      duration: 240,
    },
    {
      id: 2,
      title: 'だんご大家族',
      artist: '茶太',
      album: 'CLANNAD Original Soundtrack',
      cover: '/album-cover-2.jpg',
      duration: 210,
    },
    {
      id: 3,
      title: '渚',
      artist: '折戸伸治',
      album: 'CLANNAD Original Soundtrack',
      cover: '/album-cover-3.jpg',
      duration: 195,
    },
    {
      id: 4,
      title: '汐',
      artist: '折戸伸治',
      album: 'CLANNAD Original Soundtrack',
      cover: '/album-cover-4.jpg',
      duration: 220,
    },
    {
      id: 5,
      title: '同じ高み',
      artist: 'eufonius',
      album: 'CLANNAD Original Soundtrack',
      cover: '/album-cover-5.jpg',
      duration: 230,
    },
    {
      id: 6,
      title: '遙かな年月',
      artist: 'riya',
      album: 'CLANNAD Original Soundtrack',
      cover: '/album-cover-6.jpg',
      duration: 205,
    },
  ];

  const currentSong = playlist[currentTrack];

  // 下一曲
  const handleNext = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [playlist.length]);

  // 模拟播放进度
  useEffect(() => {
    let timer;
    if (isPlaying && currentTime < duration) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentTime, duration, handleNext]);

  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 播放/暂停
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // 上一曲
  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // 进度条点击
  const handleProgressClick = (e) => {
    if (progressBarRef.current && !isDraggingProgress) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setCurrentTime(percent * duration);
    }
  };

  // 进度条拖动开始
  const handleProgressMouseDown = (e) => {
    setIsDraggingProgress(true);
    handleProgressClick(e);
  };

  // 进度条拖动中
  const handleProgressMouseMove = useCallback((e) => {
    if (isDraggingProgress && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setCurrentTime(percent * duration);
    }
  }, [isDraggingProgress, duration]);

  // 进度条拖动结束
  const handleProgressMouseUp = useCallback(() => {
    setIsDraggingProgress(false);
  }, []);

  // 音量调节点击
  const handleVolumeClick = (e) => {
    if (volumeBarRef.current && !isDraggingVolume) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setVolume(Math.round(percent * 100));
    }
  };

  // 音量拖动开始
  const handleVolumeMouseDown = (e) => {
    setIsDraggingVolume(true);
    handleVolumeClick(e);
  };

  // 音量拖动中
  const handleVolumeMouseMove = useCallback((e) => {
    if (isDraggingVolume && volumeBarRef.current) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setVolume(Math.round(percent * 100));
    }
  }, [isDraggingVolume]);

  // 音量拖动结束
  const handleVolumeMouseUp = useCallback(() => {
    setIsDraggingVolume(false);
  }, []);

  // 监听全局鼠标事件
  useEffect(() => {
    if (isDraggingProgress) {
      document.addEventListener('mousemove', handleProgressMouseMove);
      document.addEventListener('mouseup', handleProgressMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleProgressMouseMove);
        document.removeEventListener('mouseup', handleProgressMouseUp);
      };
    }
  }, [isDraggingProgress, handleProgressMouseMove, handleProgressMouseUp]);

  useEffect(() => {
    if (isDraggingVolume) {
      document.addEventListener('mousemove', handleVolumeMouseMove);
      document.addEventListener('mouseup', handleVolumeMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleVolumeMouseMove);
        document.removeEventListener('mouseup', handleVolumeMouseUp);
      };
    }
  }, [isDraggingVolume, handleVolumeMouseMove, handleVolumeMouseUp]);

  // 选择曲目
  const selectTrack = (index) => {
    setCurrentTrack(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // 收藏切换
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="section-music">
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isFavorite={isFavorite}
        onPlayPause={togglePlay}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onProgressClick={handleProgressClick}
        onProgressMouseDown={handleProgressMouseDown}
        onVolumeClick={handleVolumeClick}
        onVolumeMouseDown={handleVolumeMouseDown}
        onFavoriteToggle={toggleFavorite}
        formatTime={formatTime}
        progressBarRef={progressBarRef}
        volumeBarRef={volumeBarRef}
      />

      <PlaylistPanel
        playlist={playlist}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onSelectTrack={selectTrack}
        formatTime={formatTime}
      />
    </div>
  );
};

export default SectionMusic;
