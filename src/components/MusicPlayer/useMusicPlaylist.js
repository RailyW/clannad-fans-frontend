import { useState, useEffect } from 'react';
import { apiService, fileService } from '../../services/api.js';

/**
 * 音乐播放列表 Hook
 * 负责从 API 获取音乐数据并处理成播放列表格式
 */
const useMusicPlaylist = (currentAlbum, currentFormat) => {
  const [musicData, setMusicData] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);

  // 从 API 获取音乐数据
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
      duration: music.duration || 240,
      cover: fileService.getMusicCover(music.ostName),
      url: fileService.getMusicFile(music.ostName, music.fileName),
      discNumber: music.discNumber,
      order: music.order,
    }));

    setPlaylist(processedPlaylist);
  }, [musicData, currentAlbum, currentFormat]);

  return {
    playlist,
    loading
  };
};

export default useMusicPlaylist;

