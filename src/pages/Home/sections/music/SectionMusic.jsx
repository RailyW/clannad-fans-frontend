import { useState, useRef, useEffect, useCallback } from 'react';
import MusicPlayer from '../../../../components/MusicPlayer/index.jsx';
import PlaylistPanel from '../../../../components/PlaylistPanel/index.jsx';
import { apiService, fileService } from '../../../../services/api.js';
import musicPreloader from '../../../../utils/musicPreloader.js';
import '../../style.less';
import './SectionMusic.less';

const SectionMusic = ({ isFirstVisit = true, isActive = false }) => {
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
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [playMode, setPlayMode] = useState('list-loop'); // 'list-loop' | 'single-loop' | 'random'

  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const audioRef = useRef(null);
  const savedTimeRef = useRef(0); // 保存切换格式时的播放位置
  const wasPlayingRef = useRef(false); // 保存切换格式前的播放状态
  const savedTrackRef = useRef(0); // 保存切换格式前的曲目索引
  const isFormatChangingRef = useRef(false); // 标记是否正在切换格式
  const handleNextRef = useRef(null); // 保存最新的 handleNext 函数引用
  const loadingTimeoutRef = useRef(null); // loading状态延迟显示的定时器
  const loadingStartTimeRef = useRef(0); // loading开始显示的时间
  const isLoadingVisibleRef = useRef(false); // loading是否已经显示
  const playPauseDebounceRef = useRef(null); // 播放/暂停防抖定时器

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
      artist: music.artist || 'VISUALARTS/Key',
      album: music.ostName,
      duration: music.duration || 240, // 默认4分钟
      cover: fileService.getMusicCover(music.ostName),
      url: fileService.getMusicFile(music.ostName, music.fileName),
      discNumber: music.discNumber,
      order: music.order,
    }));

    setPlaylist(processedPlaylist);

    // 如果是切换格式，恢复之前的曲目索引
    if (isFormatChangingRef.current && savedTrackRef.current < processedPlaylist.length) {
      setCurrentTrack(savedTrackRef.current);
      isFormatChangingRef.current = false;
    } else {
      // 否则重置到第一首
      setCurrentTrack(0);
      setCurrentTime(0);
      savedTimeRef.current = 0;
    }

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

  // 预加载当前和下一首歌曲
  useEffect(() => {
    if (playlist.length === 0 || !currentSong.url) return;

    const preloadCurrentAndNext = async () => {
      try {
        // 1. 高优先级：预加载当前歌曲（完整下载）
        console.log('[SectionMusic] Preloading current track:', currentSong.title);
        await musicPreloader.preload(currentSong.url, true);

        // 2. 低优先级：预加载下一首歌曲（后台）
        const nextTrackIndex = (currentTrack + 1) % playlist.length;
        const nextSong = playlist[nextTrackIndex];
        if (nextSong && nextSong.url) {
          console.log('[SectionMusic] Preloading next track:', nextSong.title);
          musicPreloader.preloadNext(nextSong.url);
        }
      } catch (error) {
        console.error('[SectionMusic] Preload failed:', error);
      }
    };

    preloadCurrentAndNext();
  }, [currentTrack, playlist, currentSong.url, currentSong.title]);

  // 初始化音频元素
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();

      // 音频加载开始 - 延迟显示loading
      audioRef.current.addEventListener('loadstart', () => {
        // 清除之前的定时器
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }

        // 延迟200ms后显示loading，避免快速加载时的闪烁
        loadingTimeoutRef.current = setTimeout(() => {
          setIsAudioLoading(true);
          loadingStartTimeRef.current = Date.now();
          isLoadingVisibleRef.current = true;
        }, 200);
      });

      // 音频可以播放 - 确保最小显示时间
      audioRef.current.addEventListener('canplay', () => {
        const hideLoading = () => {
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
          }
          setIsAudioLoading(false);
          isLoadingVisibleRef.current = false;
        };

        // 如果loading还未显示，取消显示
        if (!isLoadingVisibleRef.current) {
          hideLoading();
          return;
        }

        // 如果loading已显示，确保至少显示300ms
        const loadingDuration = Date.now() - loadingStartTimeRef.current;
        const minDisplayTime = 300;

        if (loadingDuration < minDisplayTime) {
          setTimeout(hideLoading, minDisplayTime - loadingDuration);
        } else {
          hideLoading();
        }
      });

      // 音频元数据加载完成
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);

        // 如果有保存的时间位置，恢复到该位置
        if (savedTimeRef.current > 0) {
          audioRef.current.currentTime = savedTimeRef.current;
          setCurrentTime(savedTimeRef.current);
        }
      });

      // 音频数据加载完成，可以开始播放
      audioRef.current.addEventListener('canplaythrough', () => {
        // 如果切换格式前在播放，则继续播放
        if (wasPlayingRef.current) {
          audioRef.current.play().catch(err => {
            console.error('Play failed:', err);
          });
          setIsPlaying(true);
          wasPlayingRef.current = false;
        }

        // 确保最小显示时间后隐藏loading
        const hideLoading = () => {
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
          }
          setIsAudioLoading(false);
          isLoadingVisibleRef.current = false;
        };

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
      });

      audioRef.current.addEventListener('timeupdate', () => {
        if (!isDraggingProgress) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });

      audioRef.current.addEventListener('ended', () => {
        // 使用 ref 中存储的最新 handleNext 函数
        if (handleNextRef.current) {
          console.log('[SectionMusic] Audio ended, calling handleNext');
          handleNextRef.current();
        }
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        // 出错时立即隐藏loading
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        setIsAudioLoading(false);
        isLoadingVisibleRef.current = false;
      });

      // 等待数据时显示加载状态 - 延迟显示
      audioRef.current.addEventListener('waiting', () => {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }

        loadingTimeoutRef.current = setTimeout(() => {
          setIsAudioLoading(true);
          loadingStartTimeRef.current = Date.now();
          isLoadingVisibleRef.current = true;
        }, 200);
      });

      // 数据到达，可以继续播放 - 确保最小显示时间
      audioRef.current.addEventListener('playing', () => {
        const hideLoading = () => {
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
          }
          setIsAudioLoading(false);
          isLoadingVisibleRef.current = false;
        };

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
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // 清理定时器
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (playPauseDebounceRef.current) {
        clearTimeout(playPauseDebounceRef.current);
      }
    };
  }, []);

  // 更新音频源和播放状态
  useEffect(() => {
    if (audioRef.current && currentSong.url) {
      // 使用缓存的 URL（如果已加载）或原始 URL
      const audioUrl = musicPreloader.getCachedUrl(currentSong.url);
      const isCached = musicPreloader.isCached(currentSong.url);

      console.log(`[SectionMusic] Loading track: ${currentSong.title}, cached: ${isCached}`);

      audioRef.current.src = audioUrl;
      audioRef.current.volume = volume / 100;

      // 如果不是切换格式导致的URL变化，重置播放位置
      if (!isFormatChangingRef.current && savedTimeRef.current === 0) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }

      // 新歌曲加载后，如果当前是播放状态，则自动播放
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Play failed:', err);
          setIsPlaying(false);
        });
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

  // 格式化时间
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 播放/暂停
  const togglePlay = useCallback(() => {
    // 如果在防抖期间，忽略点击
    if (playPauseDebounceRef.current) {
      return;
    }

    // 立即响应用户操作
    setIsPlaying((prev) => !prev);

    // 设置防抖期，300ms内不响应新的点击
    playPauseDebounceRef.current = setTimeout(() => {
      playPauseDebounceRef.current = null;
    }, 300);
  }, []);

  // 上一曲
  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    setCurrentTime(0);
    savedTimeRef.current = 0; // 清空保存的时间
    setIsPlaying(true);
  };

  // 手动点击下一曲按钮（不受播放模式影响，始终切换到下一首）
  const handleManualNext = () => {
    if (playlist.length === 0) return;

    if (playMode === 'random') {
      // 随机播放：随机选择一首歌（避免选到当前正在播放的）
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
      // 列表循环和单曲循环：都播放下一首
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    }
    setCurrentTime(0);
    savedTimeRef.current = 0;
    setIsPlaying(true);
  };

  // 根据播放模式处理自动播放结束时的下一曲逻辑
  const handleNext = useCallback(() => {
    if (playlist.length === 0) return;

    if (playMode === 'single-loop') {
      // 单曲循环：重新播放当前曲目
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        setIsPlaying(true);
        audioRef.current.play().catch(err => {
          console.error('Play failed:', err);
          setIsPlaying(false);
        });
      }
    } else if (playMode === 'random') {
      // 随机播放：随机选择一首歌（避免选到当前正在播放的）
      let randomIndex;
      if (playlist.length > 1) {
        do {
          randomIndex = Math.floor(Math.random() * playlist.length);
        } while (randomIndex === currentTrack);
      } else {
        randomIndex = 0;
      }
      setCurrentTrack(randomIndex);
      setCurrentTime(0);
      savedTimeRef.current = 0;
      setIsPlaying(true);
    } else {
      // 列表循环：播放下一首
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
      setCurrentTime(0);
      savedTimeRef.current = 0;
      setIsPlaying(true);
    }
  }, [playMode, playlist.length, currentTrack]);

  // 将最新的 handleNext 存储到 ref 中，供 ended 事件监听器使用
  useEffect(() => {
    handleNextRef.current = handleNext;
  }, [handleNext]);

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
    setCurrentTime  (0);
    savedTimeRef.current = 0; // 清空保存的时间
    setIsPlaying(true);
  };

  // 切换专辑
  const handleAlbumChange = (album) => {
    setCurrentAlbum(album);
  };

  // 切换格式
  const handleFormatChange = (format) => {
    if (format === currentFormat) return;

    // 保存当前播放状态、位置和曲目索引
    if (audioRef.current) {
      savedTimeRef.current = audioRef.current.currentTime;
      wasPlayingRef.current = isPlaying;
      savedTrackRef.current = currentTrack; // 保存当前曲目索引
      isFormatChangingRef.current = true; // 标记正在切换格式

      // 暂停当前播放
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }

    // 切换格式
    setCurrentFormat(format);
  };

  // 切换播放模式
  const togglePlayMode = () => {
    setPlayMode((prevMode) => {
      if (prevMode === 'list-loop') return 'single-loop';
      if (prevMode === 'single-loop') return 'random';
      return 'list-loop';
    });
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
        playMode={playMode}
        onPlayPause={togglePlay}
        onPrevious={handlePrevious}
        onNext={handleManualNext}
        onProgressClick={handleProgressClick}
        onProgressMouseDown={handleProgressMouseDown}
        onVolumeClick={handleVolumeClick}
        onVolumeMouseDown={handleVolumeMouseDown}
        onAlbumChange={handleAlbumChange}
        onFormatChange={handleFormatChange}
        onTogglePlayMode={togglePlayMode}
        formatTime={formatTime}
        progressBarRef={progressBarRef}
        volumeBarRef={volumeBarRef}
        isDraggingProgress={isDraggingProgress}
        tempProgress={tempProgress}
        isAudioLoading={isAudioLoading}
        isFirstVisit={isFirstVisit}
        isActive={isActive}
      />

      <PlaylistPanel
        playlist={playlist}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onSelectTrack={selectTrack}
        formatTime={formatTime}
        isFirstVisit={isFirstVisit}
        isActive={isActive}
      />
    </div>
  );
};

export default SectionMusic;
