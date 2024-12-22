import { useState, useEffect } from 'react';
import Game from './Components/Game';
import './index.css';
import { IoIosArrowDropdown } from "react-icons/io";

function App() {
  const animalEmojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];
  const numbersArray = Array.from({ length: 36 }, (_, i) => i + 1); // Supports up to 6x6 grid
  const creativeArray = ['🌌', '🛸', '🧞‍♂️', '🎨', '💡', '📚', '🎉', '🌈', '🚀', '🧩', '🎭', '🧸', '✨', '🎵', '🌟'];

  const [gridLength, setGridLength] = useState(4);
  const [theme, setTheme] = useState('numbers');
  const [shuffledArray, setShuffledArray] = useState([]);

  const generateShuffledArray = (theme) => {
    const totalTiles = gridLength * gridLength;
    let selectedArray = [];
    if (theme === 'numbers') {
      selectedArray = numbersArray.slice(0, totalTiles / 2);
    } else if (theme === 'animals') {
      selectedArray = animalEmojis.slice(0, totalTiles / 2);
    } else if (theme === 'emoji') {
      selectedArray = creativeArray.slice(0, totalTiles / 2);
    }
    const combinedArray = [...selectedArray, ...selectedArray];
    return combinedArray.sort(() => Math.random() - 0.5);
  };

  const shuffleAndRestart = () => {
    setShuffledArray(generateShuffledArray(theme));
  };

  const handleThemeChange = (event) => {
    const themeName = event.target.dataset.name;
    setTheme(themeName);
  };

  const handleGridSizeChange = (event) => {
    const gridSize = parseInt(event.target.dataset.name);
    setGridLength(gridSize);
  };


  useEffect(() => {
    shuffleAndRestart();
  }, [theme, gridLength]);

  return (
    <>
      <h1 className="main-heading">Memory Game</h1>
      <div className="game-selection">
        <div className="first-choice">
          <div className="first-choice-main">
            <p className="first-choice-heading">Theme</p>
            <IoIosArrowDropdown className="dropdown-icon" />
          </div>
          <div className="dropdown-content">
            <ul>
              <li data-name="animals" onClick={handleThemeChange}>Animals</li>
              <li data-name="numbers" onClick={handleThemeChange}>Numbers</li>
              <li data-name="emoji" onClick={handleThemeChange}>Emoji</li>
            </ul>
          </div>
        </div>
        <div className="second-choice">
          <div className="second-choice-main">
            <p className="second-choice-heading">Grid Size</p>
            <IoIosArrowDropdown className="dropdown-icon" />
          </div>
          <div className="dropdown-content">
            <ul>
              <li data-name="2" onClick={handleGridSizeChange}>2x2</li>
              <li data-name="4" onClick={handleGridSizeChange}>4x4</li>
              <li data-name="6" onClick={handleGridSizeChange}>6x6</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <button className="restart-button" onClick={shuffleAndRestart}>Restart</button>
      </div>
      <Game size={gridLength} shuffledArray={shuffledArray} />
    </>
  );
}

export default App;
