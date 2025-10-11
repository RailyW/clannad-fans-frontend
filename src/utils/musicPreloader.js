/**
 * 音乐预加载管理器
 * 功能：
 * 1. 优先保障当前播放位置的流畅性
 * 2. 后台完整下载当前歌曲
 * 3. 预加载下一首歌曲
 * 4. 利用浏览器缓存机制
 */

class MusicPreloader {
  constructor() {
    // 缓存已加载的音频 Blob URL
    this.cache = new Map();
    // 正在加载的 Promise 队列
    this.loadingQueue = new Map();
    // 预加载的 Audio 元素（用于触发浏览器缓存）
    this.preloadAudios = new Map();
  }

  /**
   * 预加载音乐文件
   * @param {string} url - 音乐 URL
   * @param {boolean} priority - 是否高优先级（当前播放的歌曲）
   * @returns {Promise<string>} Blob URL 或原始 URL
   */
  async preload(url, priority = false) {
    // 如果已经缓存，直接返回
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    // 如果正在加载，返回现有的 Promise
    if (this.loadingQueue.has(url)) {
      return this.loadingQueue.get(url);
    }

    // 创建新的加载 Promise
    const loadPromise = this._loadAudio(url, priority);
    this.loadingQueue.set(url, loadPromise);

    try {
      const result = await loadPromise;
      this.loadingQueue.delete(url);
      return result;
    } catch (error) {
      this.loadingQueue.delete(url);
      throw error;
    }
  }

  /**
   * 内部方法：加载音频文件
   * @private
   */
  async _loadAudio(url, priority) {
    try {
      // 使用 fetch 下载完整文件
      const response = await fetch(url, {
        mode: 'cors', // 明确指定 CORS 模式
        cache: 'force-cache', // 强制使用缓存
        credentials: 'omit', // 不发送凭证，简化 CORS
      });

      if (!response.ok) {
        throw new Error(`Failed to load audio: ${response.status}`);
      }

      // 将响应转换为 Blob
      const blob = await response.blob();

      // 创建 Blob URL
      const blobUrl = URL.createObjectURL(blob);

      // 缓存 Blob URL
      this.cache.set(url, blobUrl);

      console.log(`[MusicPreloader] Loaded and cached: ${url} (priority: ${priority ? 'high' : 'low'})`);

      return blobUrl;
    } catch (error) {
      console.error(`[MusicPreloader] Failed to load ${url}:`, error);
      // 加载失败时返回原始 URL，让浏览器处理
      return url;
    }
  }

  /**
   * 预加载下一首歌曲（低优先级，后台静默加载）
   * @param {string} url - 音乐 URL
   */
  preloadNext(url) {
    if (!this.cache.has(url) && !this.loadingQueue.has(url)) {
      // 使用 Audio 元素预加载，触发浏览器缓存
      if (!this.preloadAudios.has(url)) {
        const audio = new Audio();
        audio.preload = 'auto'; // 自动预加载
        audio.src = url;
        this.preloadAudios.set(url, audio);

        // 开始实际加载（后台）
        this.preload(url, false).catch(err => {
          console.warn('[MusicPreloader] Background preload failed:', err);
        });
      }
    }
  }

  /**
   * 获取缓存的 URL
   * @param {string} url - 原始 URL
   * @returns {string} 缓存的 Blob URL 或原始 URL
   */
  getCachedUrl(url) {
    return this.cache.get(url) || url;
  }

  /**
   * 检查是否已缓存
   * @param {string} url - 音乐 URL
   * @returns {boolean}
   */
  isCached(url) {
    return this.cache.has(url);
  }

  /**
   * 清理指定 URL 的缓存
   * @param {string} url - 音乐 URL
   */
  clear(url) {
    if (this.cache.has(url)) {
      const blobUrl = this.cache.get(url);
      URL.revokeObjectURL(blobUrl);
      this.cache.delete(url);
    }

    if (this.preloadAudios.has(url)) {
      const audio = this.preloadAudios.get(url);
      audio.src = '';
      this.preloadAudios.delete(url);
    }
  }

  /**
   * 清理所有缓存
   */
  clearAll() {
    // 释放所有 Blob URL
    for (const blobUrl of this.cache.values()) {
      URL.revokeObjectURL(blobUrl);
    }
    this.cache.clear();

    // 清理预加载的 Audio 元素
    for (const audio of this.preloadAudios.values()) {
      audio.src = '';
    }
    this.preloadAudios.clear();

    this.loadingQueue.clear();
  }

  /**
   * 获取缓存统计信息
   * @returns {Object}
   */
  getStats() {
    return {
      cached: this.cache.size,
      loading: this.loadingQueue.size,
      preloading: this.preloadAudios.size,
    };
  }
}

// 创建单例
const musicPreloader = new MusicPreloader();

export default musicPreloader;

