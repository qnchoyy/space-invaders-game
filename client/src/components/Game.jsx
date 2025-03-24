import { useState, useCallback, useEffect } from "react";
import GameBoard from "./GameBoard";
import StartScreen from "./StartScreen";
import GameOverScreen from "./GameOverScreen";
import LevelComplete from "./LevelComplete";
import Leaderboard from "./Leaderboard";
import AuthButton from "./AuthButton";
import { GAME_STATES, MAX_LEVEL } from "../constants/gameConstants";
import { api } from "../utils/api";
import { auth } from "../firebase/auth";

const Game = ({ user, onLogout }) => {
  const [gameState, setGameState] = useState(GAME_STATES.START);
  const [score, setScore] = useState(0);
  const [enemiesLeft, setEnemiesLeft] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [bossHealth, setBossHealth] = useState(0);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [scores, setScores] = useState([]);
  const [scoresLoading, setScoresLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const startGame = useCallback((level = 1) => {
    setGameState(GAME_STATES.PLAYING);
    setCurrentLevel(level);
    setScore(0);
    setBossHealth(0);
    setBossDefeated(false);
    setShowLeaderboard(false);
  }, []);

  const endGame = useCallback((won = false) => {
    setGameState(won ? GAME_STATES.WON : GAME_STATES.GAME_OVER);
  }, []);

  const updateScore = useCallback((points) => {
    if (typeof points !== "number") return;
    setScore((prevScore) => prevScore + points);
  }, []);

  const updateEnemiesLeft = useCallback(
    (count) => {
      if (typeof count !== "number") return;

      setEnemiesLeft(count);

      if (currentLevel === 3) {
        return;
      }

      if (count === 0) {
        completeLevel();
      }
    },
    [currentLevel]
  );

  const updateBossHealth = useCallback(
    (health) => {
      if (typeof health !== "number") return;

      setBossHealth(health);

      if (health <= 0 && !bossDefeated) {
        setBossDefeated(true);

        if (currentLevel === 3) {
          completeLevel();
        }
      }
    },
    [currentLevel, bossDefeated]
  );

  const updateTimeRemaining = useCallback(
    (time) => {
      if (typeof time !== "number") return;

      setTimeRemaining(time);

      if (time <= 0 && currentLevel === 3 && !bossDefeated) {
        endGame(false);
      }
    },
    [currentLevel, bossDefeated, endGame]
  );

  const completeLevel = useCallback(() => {
    if (currentLevel < MAX_LEVEL) {
      setGameState(GAME_STATES.LEVEL_COMPLETE);
    } else {
      endGame(true);
    }
  }, [currentLevel, endGame]);

  const nextLevel = useCallback(
    (skipToLevel) => {
      if (skipToLevel && typeof skipToLevel !== "number") {
        skipToLevel = undefined;
      }

      if (skipToLevel) {
        setCurrentLevel(skipToLevel);
      } else if (currentLevel < MAX_LEVEL) {
        setCurrentLevel((prev) => prev + 1);
      } else {
        startGame(1);
        return;
      }

      setGameState(GAME_STATES.PLAYING);
      setBossDefeated(false);
    },
    [currentLevel, startGame]
  );

  const skipToBoss = useCallback(() => {
    setCurrentLevel(3);
    setGameState(GAME_STATES.PLAYING);
    setBossDefeated(false);
  }, []);

  const restartGame = useCallback(() => {
    setGameState(GAME_STATES.START);
    setShowLeaderboard(false);
  }, []);

  const toggleLeaderboard = useCallback(() => {
    setShowLeaderboard((prev) => !prev);
  }, []);

  const handleGameOver = useCallback(() => {
    endGame(false);
  }, [endGame]);

  const handleStartGame = useCallback(
    (level) => {
      if (typeof level !== "number") {
        level = 1;
      }
      startGame(level);
    },
    [startGame]
  );

  useEffect(() => {
    const fetchScoresData = async () => {
      try {
        setScoresLoading(true);
        let token = null;
        if (auth.currentUser) {
          token = await auth.currentUser.getIdToken();
        }
        const scoresData = await api.getTopScores(token);
        setScores(scoresData);
      } catch (error) {
        console.error("Error fetching scores:", error);
        setScores([]);
      } finally {
        setScoresLoading(false);
      }
    };

    fetchScoresData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-black p-4">
      {gameState !== GAME_STATES.PLAYING && (
        <div className="absolute top-4 right-4">
          <AuthButton user={user} onLogout={onLogout} />
        </div>
      )}

      {gameState === GAME_STATES.START && (
        <>
          {showLeaderboard ? (
            <Leaderboard onBack={toggleLeaderboard} user={user} />
          ) : (
            <StartScreen
              onStartGame={startGame}
              onShowLeaderboard={toggleLeaderboard}
            />
          )}
        </>
      )}

      {gameState === GAME_STATES.PLAYING && (
        <GameBoard
          onGameOver={handleGameOver}
          onUpdateScore={updateScore}
          onUpdateEnemiesLeft={updateEnemiesLeft}
          onUpdateBossHealth={updateBossHealth}
          onUpdateTimeRemaining={updateTimeRemaining}
          level={currentLevel}
          score={score}
        />
      )}

      {gameState === GAME_STATES.LEVEL_COMPLETE && (
        <LevelComplete
          onNextLevel={nextLevel}
          onSkipToBoss={skipToBoss}
          level={currentLevel}
        />
      )}

      {(gameState === GAME_STATES.GAME_OVER ||
        gameState === GAME_STATES.WON) && (
        <GameOverScreen
          score={score}
          won={gameState === GAME_STATES.WON}
          onRestartGame={restartGame}
          level={currentLevel}
          user={user}
        />
      )}
    </div>
  );
};

export default Game;
