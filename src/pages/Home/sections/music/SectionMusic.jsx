import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import AlbumSelector from '../../../../components/MusicPlayer/AlbumSelector.jsx';
import AlbumCover from '../../../../components/MusicPlayer/AlbumCover.jsx';
import SongInfo from '../../../../components/MusicPlayer/SongInfo.jsx';
import ProgressBar from '../../../../components/MusicPlayer/ProgressBar.jsx';
import PlayerControls from '../../../../components/MusicPlayer/PlayerControls.jsx';
import VolumeControl from '../../../../components/MusicPlayer/VolumeControl.jsx';
import PlaylistPanel from '../../../../components/PlaylistPanel/index.jsx';
import useAudioPlayer from '../../../../components/MusicPlayer/useAudioPlayer.js';
import useProgressBar from '../../../../components/MusicPlayer/useProgressBar.js';
import useVolumeBar from '../../../../components/MusicPlayer/useVolumeBar.js';
import useMusicPlaylist from '../../../../components/MusicPlayer/useMusicPlaylist.js';
import usePlaybackControl from '../../../../components/MusicPlayer/usePlaybackControl.js';
import musicPreloader from '../../../../utils/musicPreloader.js';
import '../../style.less';
import './SectionMusic.less';
import '../../../../components/MusicPlayer/style.less';

const SectionMusic = ({ isFirstVisit = true, isActive = false }) => {
  const [currentAlbum, setCurrentAlbum] = useState('SteamOST');
  const [currentFormat, setCurrentFormat] = useState('mp3');
  const [playMode, setPlayMode] = useState('list-loop'); // 'list-loop' | 'single-loop' | 'random'

  // 可用的专辑列表
  const albums = [
    { value: 'SteamOST', label: 'Steam Original Soundtrack' },
    { value: 'mabinogi', label: 'Mabinogi Arrange Album' }
  ];

  // 使用播放列表 Hook（获取和处理音乐数据）
  const { playlist, loading } = useMusicPlaylist(currentAlbum, currentFormat);

  // 使用播放控制 Hook
  const {
    currentTrack,
    handlePrevious,
    handleNext,
    handleAutoNext,
    selectTrack
  } = usePlaybackControl(playlist, playMode);

  // 当前歌曲
  const currentSong = playlist[currentTrack] || {
    id: 'loading',
    title: 'Loading...',
    artist: 'Loading...',
    album: 'Loading...',
    duration: 240,
    cover: null,
  };

  // 使用音频播放器 Hook
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isAudioLoading,
    togglePlay,
    seekTo,
    setVolume: setVolumeValue,
    setIsPlaying,
    audioRef
  } = useAudioPlayer({
    playlist,
    currentTrack,
    onTrackEnd: () => handleAutoNext(audioRef, setIsPlaying)
  });

  // 使用进度条 Hook
  const {
    progressBarRef,
    isDragging: isDraggingProgress,
    tempProgress,
    handleClick: handleProgressClick,
    handleMouseDown: handleProgressMouseDown
  } = useProgressBar({ duration, onSeek: seekTo });

  // 使用音量条 Hook
  const {
    volumeBarRef,
    handleClick: handleVolumeClick,
    handleMouseDown: handleVolumeMouseDown
  } = useVolumeBar({ onVolumeChange: setVolumeValue });

  // 预加载当前和下一首歌曲
  useEffect(() => {
    if (playlist.length === 0 || !currentSong.url) return;

    const preloadCurrentAndNext = async () => {
      try {
        console.log('[SectionMusic] Preloading current track:', currentSong.title);
        await musicPreloader.preload(currentSong.url, true);

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

  // 格式化时间
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 切换专辑
  const handleAlbumChange = (album) => {
    setCurrentAlbum(album);
  };

  // 切换格式
  const handleFormatChange = (format) => {
    if (format === currentFormat) return;
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

  // 选择曲目时自动播放
  const handleSelectTrack = (index) => {
    selectTrack(index);
    setIsPlaying(true);
  };

  const currentAlbumLabel = albums.find(a => a.value === currentAlbum)?.label;

  if (loading) {
    return (
      <div className="section-music">
        <div className="loading-message">加载音乐数据中...</div>
      </div>
    );
  }

  return (
    <div className="section-music">
      {/* 音乐播放器 - 直接使用子组件组合 */}
      <motion.div
        className="music-player-container"
        initial={{ opacity: 0, x: -50 }}
        animate={
          isActive && isFirstVisit
            ? { opacity: 1, x: 0 }
            : isActive
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: -50 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <AlbumSelector
          albums={albums}
          currentAlbum={currentAlbum}
          onAlbumChange={handleAlbumChange}
        />

        <AlbumCover
          song={currentSong}
          isPlaying={isPlaying}
          isLoading={isAudioLoading}
        />

        <SongInfo
          song={currentSong}
          albumLabel={currentAlbumLabel}
        />

        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          progressBarRef={progressBarRef}
          onProgressClick={handleProgressClick}
          onProgressMouseDown={handleProgressMouseDown}
          formatTime={formatTime}
          isDragging={isDraggingProgress}
          tempProgress={tempProgress}
        />

        <PlayerControls
          isPlaying={isPlaying}
          isLoading={isAudioLoading}
          onPlayPause={togglePlay}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        <VolumeControl
          volume={volume}
          volumeBarRef={volumeBarRef}
          onVolumeClick={handleVolumeClick}
          onVolumeMouseDown={handleVolumeMouseDown}
          currentFormat={currentFormat}
          onFormatChange={handleFormatChange}
          playMode={playMode}
          onTogglePlayMode={togglePlayMode}
        />
      </motion.div>

      {/* 播放列表面板 */}
      <PlaylistPanel
        playlist={playlist}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onSelectTrack={handleSelectTrack}
        formatTime={formatTime}
        isFirstVisit={isFirstVisit}
        isActive={isActive}
      />
    </div>
  );
};

export default SectionMusic;
