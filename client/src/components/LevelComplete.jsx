import { MAX_LEVEL } from "../constants/gameConstants";

const LevelComplete = ({ level, score, onNextLevel }) => {
  const handleNextLevel = () => {
    onNextLevel();
  };

  const handleSkipToBoss = () => {
    onNextLevel(3);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-80 p-6 rounded-lg border-2 border-green-500 text-center max-w-md mx-auto">
        <h2 className="text-green-500 text-2xl font-bold mb-4">
          {level === MAX_LEVEL
            ? "Congratulations! You completed the game!"
            : `Level ${level} Completed!`}
        </h2>
        <p className="text-white mb-4">Score: {score}</p>
        {level === 1 && (
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleNextLevel}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Continue to Level 2
            </button>
            <button
              onClick={handleSkipToBoss}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Skip to Boss
            </button>
          </div>
        )}
        {level === 2 && (
          <div>
            <p className="text-yellow-300 mb-4">
              Warning: Level 3 contains a powerful boss. Prepare for a
              challenge!
            </p>
            <button
              onClick={handleNextLevel}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Face the Boss
            </button>
          </div>
        )}
        {level === 3 && (
          <button
            onClick={handleNextLevel}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Finish Game
          </button>
        )}
      </div>
    </div>
  );
};

export default LevelComplete;
