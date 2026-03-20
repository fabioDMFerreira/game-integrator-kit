import React, { useEffect, useRef, useCallback } from 'react';
import './Game.css';

interface GameProps {
  load: (container: HTMLElement) => void;
  setSize: (width: number, height: number) => void;
}

function Game({ load, setSize }: GameProps): React.ReactElement {
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);

  const handleResize = useCallback(() => {
    if (gameContainerRef.current) {
      const rect = gameContainerRef.current.getBoundingClientRect();
      setSize(rect.width, rect.height);
    }
  }, [setSize]);

  useEffect(() => {
    // Initial load
    if (gameContainerRef.current) {
      load(gameContainerRef.current);
    }

    // Setup resize observer with debounce
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimeoutRef.current) {
        window.cancelAnimationFrame(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = window.requestAnimationFrame(() => {
        handleResize();
      });
    });

    if (gameContainerRef.current) {
      resizeObserver.observe(gameContainerRef.current);
    }

    // Cleanup
    return () => {
      if (resizeTimeoutRef.current) {
        window.cancelAnimationFrame(resizeTimeoutRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [load, handleResize]);

  return React.createElement('div', {
    id: 'gameContainer',
    ref: gameContainerRef,
    style: { width: '100%', height: '100%' },
  });
}

export default Game;
