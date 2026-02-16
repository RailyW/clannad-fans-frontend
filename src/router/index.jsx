import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home/index.jsx';
// import Music from '../pages/Music/index.jsx';

const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <Navigate to="/home" replace />
  // },
  {
    path: '/home',
    element: <Home />
  },
  // {
  //   path: '/music',
  //   element: <Music />
  // }
]);

export default router;


