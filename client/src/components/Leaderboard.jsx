import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { auth } from "../firebase/auth";

const Leaderboard = ({ onBack, user }) => {
  const [scores, setScores] = useState([]);
  const [userScores, setUserScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserScores, setShowUserScores] = useState(false);
  const [completedAllLevels, setCompletedAllLevels] = useState(false);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        setError(null);

        let token = null;
        if (auth.currentUser) {
          token = await auth.currentUser.getIdToken();
        }

        try {
          const topScores = await api.getTopScores(token);
          setScores(topScores);

          if (user && user.uid) {
            const userScoreData = await api.getUserScores(user.uid, token);
            setUserScores(userScoreData);

            setCompletedAllLevels(
              userScoreData.some(
                (score) => score.level === 3 && score.defeatedBoss
              )
            );
          }
        } catch (error) {
          if (
            error instanceof TypeError &&
            error.message.includes("Failed to fetch")
          ) {
            setError(
              "Cannot connect to server. Please check if the server is running."
            );

            setScores([
              {
                _id: "demo1",
                playerName: "Demo Player 1",
                score: 3500,
                level: 3,
                defeatedBoss: true,
              },
              {
                _id: "demo2",
                playerName: "Demo Player 2",
                score: 2800,
                level: 2,
                defeatedBoss: false,
              },
              {
                _id: "demo3",
                playerName: "Demo Player 3",
                score: 1200,
                level: 1,
                defeatedBoss: false,
              },
            ]);
          } else {
            throw error;
          }
        }
      } catch (err) {
        console.error("Error fetching scores:", err);
        setError("An error occurred while loading scores.");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [user]);

  const toggleScoreView = () => {
    setShowUserScores((prev) => !prev);
  };

  const getScoreList = () => {
    return showUserScores ? userScores : scores;
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {showUserScores ? "Your Scores" : "Top Scores"}
      </h2>

      {user && (
        <div className="mb-4">
          <button
            onClick={toggleScoreView}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded text-sm"
          >
            {showUserScores ? "Show Global Scores" : "Show My Scores"}
          </button>

          {showUserScores && completedAllLevels && (
            <div className="mt-3 bg-yellow-800 bg-opacity-40 p-3 rounded text-yellow-300 text-sm">
              <span className="font-bold">🏆 Congratulations!</span> You've
              completed all game levels and defeated the boss!
            </div>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-400 mb-2">{error}</p>
          {error.includes("connect to server") && (
            <p className="text-yellow-300 text-sm">
              Showing sample results. To see actual results, please make sure
              the server is running.
            </p>
          )}
        </div>
      ) : getScoreList().length === 0 ? (
        <p className="text-center">
          {showUserScores
            ? "You don't have any saved scores"
            : "No scores saved yet"}
        </p>
      ) : (
        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="py-2 px-2">#</th>
                <th className="py-2 px-2">Player</th>
                <th className="py-2 px-2">Score</th>
                <th className="py-2 px-2">Level</th>
                <th className="py-2 px-2">Boss</th>
              </tr>
            </thead>
            <tbody>
              {getScoreList().map((score, index) => (
                <tr
                  key={score._id}
                  className={`border-b border-gray-700 hover:bg-gray-700 ${
                    score.defeatedBoss && score.level === 3
                      ? "bg-yellow-900 bg-opacity-30"
                      : ""
                  }`}
                >
                  <td className="py-2 px-2">{index + 1}</td>
                  <td className="py-2 px-2">
                    {score.playerName}
                    {user && score.userId === user.uid && (
                      <span className="ml-2 text-blue-300 text-xs">(You)</span>
                    )}
                  </td>
                  <td className="py-2 px-2 font-bold text-yellow-400">
                    {score.score}
                  </td>
                  <td className="py-2 px-2">{score.level}</td>
                  <td className="py-2 px-2">
                    {score.defeatedBoss ? (
                      <span className="text-green-500 font-bold">✓</span>
                    ) : (
                      <span className="text-red-500">✗</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={onBack}
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Back
      </button>
    </div>
  );
};

export default Leaderboard;
