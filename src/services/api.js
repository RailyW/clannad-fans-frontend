/**
 * API Services
 * 封装所有 API 接口调用
 */

import { get, getFileUrl } from '../utils/request.js';

/**
 * API 服务对象
 */
const apiService = {
  /**
   * 获取 API 根信息
   * GET /
   * @returns {Promise} API 信息
   */
  getRoot: () => {
    return get('/');
  },

  /**
   * 获取角色列表
   * GET /characters
   * @param {Object} params - 查询参数
   * @returns {Promise} 角色列表数据
   */
  getCharacters: (params = {}) => {
    return get('/characters', params);
  },

  /**
   * 获取图片列表
   * GET /images
   * @param {Object} params - 查询参数
   * @returns {Promise} 图片列表数据
   */
  getImages: (params = {}) => {
    return get('/images', params);
  },

  /**
   * 获取音乐列表
   * GET /musics
   * @param {Object} params - 查询参数
   * @returns {Promise} 音乐列表数据
   */
  getMusics: (params = {}) => {
    return get('/musics', params);
  },

  /**
   * 获取语音名称列表
   * GET /voice-name-list
   * @param {Object} params - 查询参数
   * @returns {Promise} 语音名称列表数据
   */
  getVoiceNameList: (params = {}) => {
    return get('/voice-name-list', params);
  },

  /**
   * 获取语音列表
   * GET /voices
   * @param {Object} params - 查询参数
   * @returns {Promise} 语音列表数据
   */
  getVoices: (params = {}) => {
    return get('/voices', params);
  },
};

/**
 * 文件服务对象
 */
const fileService = {
  /**
   * 获取文件完整 URL
   * @param {string} filePath - 文件路径
   * @returns {string} 完整的文件 URL
   */
  getFileUrl: (filePath) => {
    return getFileUrl(filePath);
  },

  /**
   * 获取图片 URL
   * @param filename {string} 文件名
   * @returns {string} 图片文件 URL
   */
  getImageUrl: (filename) => {
    return getFileUrl(`images/${filename}`);
  },

  /**
   * 获取音乐文件 URL
   * @param {string} album - 专辑名
   * @param {string} filename - 文件名
   * @returns {string} 音乐文件 URL
   */
  getMusicFile: (album, filename) => {
    return getFileUrl(`music/${album}/${filename}`);
  },

  /**
   * 获取音乐封面 URL
   * @param {string} album - 专辑名
   * @returns {string} 封面文件 URL
   */
  getMusicCover: (album) => {
    return getFileUrl(`music/${album}/cover.jpg`);
  },

  /**
   * 获取语音文件 URL
   * @param {string} filename - 文件名
   * @returns {string} 语音文件 URL
   */
  getVoiceFile: (filename) => {
    return getFileUrl(`voices/${filename}`);
  },
};

export { apiService, fileService };
export default apiService;
