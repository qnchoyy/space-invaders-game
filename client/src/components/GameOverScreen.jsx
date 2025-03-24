import { useState, useEffect, useRef } from "react";
import { api } from "../utils/api";
import { auth } from "../firebase/auth";

const GameOverScreen = ({ score, won, onRestartGame, level, user }) => {
  const [saveStatus, setSaveStatus] = useState({
    inProgress: false,
    success: false,
    error: null,
  });
  const [completedAllLevels, setCompletedAllLevels] = useState(false);
  const [isCheckingCompletionStatus, setIsCheckingCompletionStatus] =
    useState(false);
  const hasAttemptedSave = useRef(false);

  useEffect(() => {
    const saveScore = async () => {
      if (!user || !user.uid || hasAttemptedSave.current) return;

      hasAttemptedSave.current = true;

      try {
        setSaveStatus({ inProgress: true, success: false, error: null });

        const scoreData = {
          playerName: user.email.split("@")[0],
          score,
          level,
          defeatedBoss: won && level === 3,
          userId: user.uid,
        };

        let token = null;
        if (auth.currentUser) {
          token = await auth.currentUser.getIdToken();
        }

        console.log(
          "Attempting to save score for user",
          user.uid,
          "score:",
          score
        );

        const result = await api.saveScore(scoreData, token);

        setSaveStatus({
          inProgress: false,
          success: true,
          error: null,
          message: result.message,
        });
      } catch (error) {
        console.error("Error saving score:", error);
        setSaveStatus({
          inProgress: false,
          success: false,
          error: "Could not save score automatically",
        });
      }
    };

    saveScore();
  }, [user, score, level, won]);

  useEffect(() => {
    const checkCompletionStatus = async () => {
      if (user && user.uid && won && level === 3) {
        try {
          setIsCheckingCompletionStatus(true);

          const token = await auth.currentUser.getIdToken();

          const hasCompleted = await api.hasCompletedAllLevels(user.uid, token);
          setCompletedAllLevels(hasCompleted);
        } catch (error) {
          console.error("Error checking completion status:", error);
          setCompletedAllLevels(false);
        } finally {
          setIsCheckingCompletionStatus(false);
        }
      }
    };

    checkCompletionStatus();
  }, [user, won, level]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 p-6 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-2">
        {won ? "You won!" : "Game Over"}
      </h2>
      <p className="mb-2">Level: {level}</p>
      <p className="mb-4">Final score: {score}</p>

      {won && level === 3 && (
        <div className="mb-4 text-yellow-300 text-center">
          <p className="font-bold">Congratulations! You defeated the boss!</p>
          {isCheckingCompletionStatus ? (
            <p className="text-sm mt-1">Checking your achievements...</p>
          ) : completedAllLevels ? (
            <p className="text-sm mt-1">
              You have successfully completed all levels in the game!
            </p>
          ) : (
            <p className="text-sm mt-1">
              This is your first victory over the boss!
            </p>
          )}
        </div>
      )}

      {!won && level === 3 && (
        <p className="mb-4 text-red-400">The boss defeated you! Try again!</p>
      )}

      {user && (
        <div className="mb-4 text-center">
          {saveStatus.inProgress ? (
            <p className="text-blue-300">Saving your score...</p>
          ) : saveStatus.success ? (
            <div className="text-green-400">
              {saveStatus.message === "Existing result is higher" ? (
                <p>Your best score is still higher!</p>
              ) : (
                <p>Score saved to leaderboard!</p>
              )}
            </div>
          ) : saveStatus.error ? (
            <p className="text-red-400 text-sm">{saveStatus.error}</p>
          ) : null}
        </div>
      )}

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={onRestartGame}
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOverScreen;
