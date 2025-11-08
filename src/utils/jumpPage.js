/**
 * 页面跳转工具函数
 * @param {string} path - 目标路由路径
 * @param {object} navigate - React Router 的 navigate 函数
 */
export const jumpPage = (path, navigate) => {
  if (!navigate) {
    console.error('[jumpPage] navigate 函数未提供');
    return;
  }
  navigate(path);
};

export default jumpPage;

