/**
 * useApi Hook
 * React Hook for API calls with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * API 调用 Hook
 * @param {Function} apiFunction - API 调用函数
 * @param {Object} options - 配置选项
 * @returns {Object} { data, loading, error, refetch }
 */
export const useApi = (apiFunction, options = {}) => {
  const { immediate = false, params = {} } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (executeParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction({ ...params, ...executeParams });
      setData(result.data || result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
};

/**
 * 简化版 API Hook - 自动执行
 * @param {Function} apiFunction - API 调用函数
 * @param {Object} params - 请求参数
 * @returns {Object} { data, loading, error, refetch }
 */
export const useApiCall = (apiFunction, params = {}) => {
  return useApi(apiFunction, { immediate: true, params });
};

export default useApi;

