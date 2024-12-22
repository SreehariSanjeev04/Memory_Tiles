import React, { useEffect, useState, useRef } from 'react';
import '../Style/Game.css';

function Game({ size, shuffledArray }) {
  const [bestScore, setBestScore] = useState(Number(localStorage.getItem('memory_game_best_score')) || 0);
  const click = new Audio('/click.wav');
  const lose = new Audio('/lose.flac');
  const victory = new Audio('/victory.wav');
  const [currentScore, setCurrentScore] = useState(0);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    resetGame();
    return () => clearInterval(timerRef.current);
  }, [shuffledArray, size]);

  const resetGame = () => {
    setFlipped([]);
    setMatched([]);
    setCurrentScore(0);
    setTimeLeft(60);
    setIsGameOver(false);
    revealCards();
    startTimer();
  };

  const revealCards = () => {
    setFlipped(shuffledArray.map((_, index) => index));
    setTimeout(() => {
      setFlipped([]);
    }, 2000);
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          lose.play();
          setIsGameOver(true);
          updateBestScore();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const updateBestScore = () => {
    if (currentScore > bestScore) {
      localStorage.setItem('memory_game_best_score', currentScore);
      setBestScore(currentScore);
    }
  };

  const handleTileClick = (index) => {
    click.play();
    if (isGameOver || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length >= 2) {
      const [first, second] = newFlipped;
      if (first !== second && shuffledArray[first] === shuffledArray[second]) {
        const newMatched = [...matched, first, second];
        setMatched(newMatched);
        setCurrentScore(currentScore + 1);

        if (newMatched.length === shuffledArray.length) {
          setIsGameOver(true);
          victory.play();
          clearInterval(timerRef.current);
          updateBestScore();
        }
      }
      setTimeout(() => {
        setFlipped([]);
      }, 1000);
    }
  };

  const restartGame = () => {
    resetGame();
  };

  return (
    <div className="main-content">
      <div className="main-content-text">
        <p>Score: {currentScore}</p>
        <p>Best Score: {bestScore}</p>
        <p>Time Left: {timeLeft} seconds</p>
      </div>
      <div className="game-container">
        <div className={`grid-${size}`}>
          {shuffledArray.map((num, index) => (
            <div
              key={index}
              className={`tile ${matched.includes(index) || flipped.includes(index) ? '' : 'flipped'}`}
              onClick={() => handleTileClick(index)}
            >
              <div className="front">{num}</div>
              <div className="back"></div>
            </div>
          ))}
        </div>
      </div>
      {isGameOver && (
        <div className="game-over-overlay">
          <h2>{matched.length === shuffledArray.length ? 'You Won!' : 'Game Over!'}</h2>
          <button onClick={restartGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default Game;
