import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppstoreOutlined } from '@ant-design/icons';

const AlbumSelector = ({ albums, currentAlbum, onAlbumChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const currentAlbumLabel = albums.find(a => a.value === currentAlbum)?.label;

  return (
    <div className="player-settings">
      <div className="setting-group">
        <label>专辑</label>
        <div className="album-selector-wrapper" ref={dropdownRef}>
          <motion.div
            className="custom-select"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AppstoreOutlined className="album-icon" />
            <span className="selected-value">{currentAlbumLabel}</span>
            <motion.span
              className="dropdown-arrow"
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </motion.div>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                className="dropdown-menu"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {albums.map((album) => (
                  <div
                    key={album.value}
                    className={`dropdown-item ${currentAlbum === album.value ? 'active' : ''}`}
                    onClick={() => {
                      onAlbumChange(album.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span className="item-icon">♪</span>
                    <span className="item-text">{album.label}</span>
                    {currentAlbum === album.value && (
                      <motion.span
                        className="check-icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AlbumSelector;

