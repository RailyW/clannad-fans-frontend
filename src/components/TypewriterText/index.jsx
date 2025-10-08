import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

const TypewriterText = ({ text, className, delay = 0, speed = 0.05, deleteSpeed = 0.03 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const prevTextRef = useRef('');
  const [newText, setNewText] = useState(text);

  // 监听文本变化
  useEffect(() => {
    if (!prevTextRef.current) {
      // 第一次初始化
      prevTextRef.current = text;
      setDisplayedText('');
      setCurrentIndex(0);
      setNewText(text);
    } else if (prevTextRef.current !== text) {
      // 文本改变了
      setNewText(text);
      if (displayedText.length > 0) {
        // 有旧文本，需要先删除
        setIsDeleting(true);
      } else {
        // 没有旧文本，直接开始打字新文本
        prevTextRef.current = text;
        setCurrentIndex(0);
        setIsDeleting(false);
      }
    }
  }, [text, displayedText.length]);

  // 删除效果
  useEffect(() => {
    if (isDeleting) {
      if (displayedText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayedText((prev) => prev.slice(0, -1));
        }, deleteSpeed * 1000);
        return () => clearTimeout(timer);
      } else {
        // 删除完毕，准备开始打字新文本
        setIsDeleting(false);
        prevTextRef.current = newText;
        setCurrentIndex(0);
      }
    }
  }, [isDeleting, displayedText, deleteSpeed, newText]);

  // 打字效果
  useEffect(() => {
    if (!isDeleting && prevTextRef.current === newText && currentIndex < newText.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + newText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed * 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, newText, speed, isDeleting]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {displayedText}
      {((isDeleting && displayedText.length > 0) || (!isDeleting && currentIndex < newText.length)) && (
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
