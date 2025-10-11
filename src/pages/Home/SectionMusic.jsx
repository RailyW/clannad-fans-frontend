import { useState, useRef, useEffect, useCallback } from 'react';
import MusicPlayer from '../../components/MusicPlayer/index.jsx';
import PlaylistPanel from '../../components/PlaylistPanel/index.jsx';
import { apiService, fileService } from '../../services/api.js';
import './style.less';
import './SectionMusic.less';

const SectionMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240);
  const [volume, setVolume] = useState(70);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [tempProgress, setTempProgress] = useState(0); // 用于记录拖动时的临时进度
  const [currentAlbum, setCurrentAlbum] = useState('SteamOST');
  const [currentFormat, setCurrentFormat] = useState('mp3');
  const [musicData, setMusicData] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);

  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const audioRef = useRef(null);

  // 可用的专辑列表
  const albums = [
    { value: 'SteamOST', label: 'Steam Original Soundtrack' },
    { value: 'mabinogi', label: 'Mabinogi Arrange Album' }
  ];

  // 从API获取音乐数据
  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getMusics();
        if (response.success && response.data.musics) {
          setMusicData(response.data.musics);
        }
      } catch (error) {
        console.error('Failed to fetch music data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicData();
  }, []);

  // 根据当前专辑和格式过滤播放列表
  useEffect(() => {
    if (musicData.length === 0) return;

    // 过滤出当前专辑和格式的音乐
    const filteredMusics = musicData.filter(
      music => music.ostName === currentAlbum && music.type === currentFormat
    );

    // 去重并排序
    const uniqueMusics = [];
    const seen = new Set();

    filteredMusics
      .sort((a, b) => {
        if (a.discNumber !== b.discNumber) {
          return a.discNumber - b.discNumber;
        }
        return a.order - b.order;
      })
      .forEach(music => {
        const key = `${music.discNumber}-${music.order}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueMusics.push(music);
        }
      });

    // 转换为播放列表格式
    const processedPlaylist = uniqueMusics.map((music) => ({
      id: `${music.ostName}-${music.discNumber}-${music.order}`,
      title: music.musicName,
      artist: music.artist || 'not found',
      album: music.ostName,
      duration: music.duration || 240, // 默认4分钟
      cover: fileService.getMusicCover(music.ostName),
      url: fileService.getMusicFile(music.ostName, music.fileName),
      discNumber: music.discNumber,
      order: music.order,
    }));

    setPlaylist(processedPlaylist);
    setCurrentTrack(0);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [musicData, currentAlbum, currentFormat]);

  const currentSong = playlist[currentTrack] || {
    id: 'loading',
    title: 'Loading...',
    artist: 'Loading...',
    album: 'Loading...',
    duration: 240,
    cover: null,
  };

  // 初始化音频元素
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();

      // 音频事件监听
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        if (!isDraggingProgress) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });

      audioRef.current.addEventListener('ended', () => {
        handleNext();
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // 更新音频源和播放状态
  useEffect(() => {
    if (audioRef.current && currentSong.url) {
      audioRef.current.src = currentSong.url;
      audioRef.current.volume = volume / 100;

      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Play failed:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong.url]);

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

  // 下一曲
  const handleNext = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [playlist.length]);

  // 格式化时间
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
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
    // 只在非拖动状态下响应点击
    if (progressBarRef.current && !isDraggingProgress && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = percent * duration;

      // 直接设置音频时间并跳转
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // 进度条拖动开始
  const handleProgressMouseDown = (e) => {
    if (progressBarRef.current && audioRef.current) {
      setIsDraggingProgress(true);

      // 计算并记录临时进度
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = percent * duration;
      setTempProgress(newTime);
    }
  };

  // 进度条拖动中
  const handleProgressMouseMove = useCallback((e) => {
    if (isDraggingProgress && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = percent * duration;

      // 拖动时更新临时进度，不改变实际音频位置
      setTempProgress(newTime);
    }
  }, [isDraggingProgress, duration]);

  // 进度条拖动结束
  const handleProgressMouseUp = useCallback(() => {
    if (isDraggingProgress && audioRef.current) {
      // 拖动结束后才设置音频位置到临时进度记录的位置
      audioRef.current.currentTime = tempProgress;
      setCurrentTime(tempProgress);

      setIsDraggingProgress(false);
    }
  }, [isDraggingProgress, tempProgress]);

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

  // 切换专辑
  const handleAlbumChange = (album) => {
    setCurrentAlbum(album);
  };

  // 切换格式
  const handleFormatChange = (format) => {
    setCurrentFormat(format);
  };

  if (loading) {
    return (
      <div className="section-music">
        <div className="loading-message">加载音乐数据中...</div>
      </div>
    );
  }

  return (
    <div className="section-music">
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        currentAlbum={currentAlbum}
        currentFormat={currentFormat}
        albums={albums}
        onPlayPause={togglePlay}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onProgressClick={handleProgressClick}
        onProgressMouseDown={handleProgressMouseDown}
        onVolumeClick={handleVolumeClick}
        onVolumeMouseDown={handleVolumeMouseDown}
        onAlbumChange={handleAlbumChange}
        onFormatChange={handleFormatChange}
        formatTime={formatTime}
        progressBarRef={progressBarRef}
        volumeBarRef={volumeBarRef}
        isDraggingProgress={isDraggingProgress}
        tempProgress={tempProgress}
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
