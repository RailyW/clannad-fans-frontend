/**
 * API Request Utility
 * 统一的 API 请求封装
 */

// API 基础地址配置
export const API_BASE_URL = 'https://api.clannad.fans';
export const FILES_BASE_URL = 'https://files.clannad.fans';

/**
 * 通用请求函数
 * @param {string} url - 请求地址
 * @param {Object} options - fetch 选项
 * @returns {Promise} 请求结果
 */
export const request = async (url, options = {}) => {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);

    // 检查 HTTP 状态码
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    // 解析 JSON 响应
    const data = await response.json();

    // 检查业务状态码
    if (data.success === false) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * GET 请求
 * @param {string} endpoint - API 端点
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求结果
 */
export const get = async (endpoint, params = {}) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  // 添加查询参数
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });

  return request(url.toString());
};

/**
 * POST 请求
 * @param {string} endpoint - API 端点
 * @param {Object} data - 请求体数据
 * @returns {Promise} 请求结果
 */
export const post = async (endpoint, data = {}) => {
  return request(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT 请求
 * @param {string} endpoint - API 端点
 * @param {Object} data - 请求体数据
 * @returns {Promise} 请求结果
 */
export const put = async (endpoint, data = {}) => {
  return request(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE 请求
 * @param {string} endpoint - API 端点
 * @returns {Promise} 请求结果
 */
export const del = async (endpoint) => {
  return request(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
  });
};

/**
 * 获取文件 URL
 * @param {string} filePath - 文件路径
 * @returns {string} 完整的文件 URL
 */
export const getFileUrl = (filePath) => {
  // 移除开头的斜杠（如果有）
  const normalizedPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  return `${FILES_BASE_URL}/${normalizedPath}`;
};

