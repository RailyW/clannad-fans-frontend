import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

const TypewriterText = ({ text, className, delay = 0, speed = 0.05, deleteSpeed = 0.03 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const prevTextRef = useRef('');

  useEffect(() => {
    // 如果文本改变，先删除旧文本
    if (prevTextRef.current && prevTextRef.current !== text && displayedText.length > 0) {
      setIsDeleting(true);
    } else if (prevTextRef.current !== text) {
      // 如果是第一次或者已经删除完毕，开始打字
      setDisplayedText('');
      setCurrentIndex(0);
      setIsDeleting(false);
      prevTextRef.current = text;
    }
  }, [text]);

  // 删除效果
  useEffect(() => {
    if (isDeleting && displayedText.length > 0) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
      }, deleteSpeed * 1000);

      return () => clearTimeout(timer);
    } else if (isDeleting && displayedText.length === 0) {
      // 删除完毕，开始打字新文本
      setIsDeleting(false);
      setCurrentIndex(0);
      prevTextRef.current = text;

      // 添加延迟后开始打字
      const delayTimer = setTimeout(() => {
        setCurrentIndex(0);
      }, delay * 1000);

      return () => clearTimeout(delayTimer);
    }
  }, [isDeleting, displayedText, deleteSpeed, delay, text]);

  // 打字效果
  useEffect(() => {
    if (!isDeleting && currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed * 1000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, isDeleting]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {displayedText}
      {(currentIndex < text.length || isDeleting) && (
        <motion.span
          className="typewriter-cursor"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          |
        </motion.span>
      )}
    </motion.span>
  );
};

export default TypewriterText;
