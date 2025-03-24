const StartScreen = ({ onStartGame, onShowLeaderboard, user }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-black bg-opacity-80 p-6 rounded-lg text-white max-w-md">
      <h1 className="text-4xl font-bold mb-2 text-green-500">Space Invaders</h1>

      {user && (
        <p className="text-yellow-400 mb-4">
          Hello, {user.email.split("@")[0]}!
        </p>
      )}

      <div className="text-center mb-6">
        <p className="mb-2">
          Control the player with <span className="text-yellow-400">left</span>{" "}
          and <span className="text-yellow-400">right</span> arrow keys.
        </p>
        <p className="mb-4">
          Shoot with <span className="text-yellow-400">space key</span>.
        </p>
        <p className="text-red-400 mb-2">
          In level 3, you must defeat the boss before time runs out!
        </p>
      </div>

      <div className="mb-6 flex space-x-4">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          onClick={() => onStartGame(1)}
        >
          Start Game
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          onClick={onShowLeaderboard}
        >
          Leaderboard
        </button>
      </div>

      <div className="flex flex-col space-y-2 w-full mt-2">
        <p className="text-center text-sm mb-1">Select level:</p>
        <div className="flex space-x-2 justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
            onClick={() => onStartGame(1)}
          >
            Level 1
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
            onClick={() => onStartGame(2)}
          >
            Level 2
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            onClick={() => onStartGame(3)}
          >
            Level 3 (Boss)
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
