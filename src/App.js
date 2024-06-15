import React, { useState, useEffect } from 'react';
import './App.css';

const generateRandomSequence = (length) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let sequence = '';
  for (let i = 0; i < length; i++) {
    sequence += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return sequence;
};

const App = () => {
  const [sequence, setSequence] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      endGame('O tempo acabou, você perdeu.');
      setGameActive(false)
    }
  }, [gameActive, timeLeft]);

  const startGame = () => {
    const newSequence = generateRandomSequence(7);
    setSequence(newSequence);
    setCurrentIndex(0);
    setTimeLeft(20);
    setGameActive(true);
    setMessage('');
  };

  const resetGame = () => {
    setSequence('');
    setCurrentIndex(0);
    setTimeLeft(20);
    setGameActive(false);
    setMessage('')
  }

  const handleKeyPress = (event) => {
    if (!gameActive) return;

    const pressedKey = event.key.toUpperCase();
    if (pressedKey === sequence[currentIndex]) {
      if (currentIndex === sequence.length - 1) {
        endGame('Parabéns, você ganhou!');
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      endGame('Tecla errada, você perdeu!.');
    }
  };

  const endGame = (endMessage) => {
    setGameActive(false);
    setMessage(endMessage);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentIndex, gameActive]);

  return (
    <div className="App">
      <h1>Minigame de Sequência de Teclas</h1>
      {!gameActive && <button onClick={startGame}>Iniciar Jogo</button>}
      {gameActive && <button onClick={resetGame}>Reiniciar Jogo</button>}
      {gameActive ? (
        <>
          <h2>Tempo Restante: {timeLeft} segundos</h2>
          <h2>Sequência: {sequence.split('').map((char, index) => (
            <span key={index} className={index === currentIndex ? 'highlight' : ''}>{char}</span>
          ))}</h2>
        </>
      ) : (
        <h2>{message}</h2>
      )}
    </div>
  );
};

export default App;
