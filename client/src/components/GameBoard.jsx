import { useState, useEffect, useCallback, useRef } from "react";
import Player from "./Player";
import Enemy from "./Enemy";
import Bullet from "./Bullet";
import Boss from "./Boss";
import useKeyPress from "../hooks/useKeyPress";
import { checkCollision } from "../utils/collisionDetection";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  LEVEL_CONFIG,
} from "../constants/gameConstants";

const generateUniqueId = (prefix) => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

const GameBoard = ({
  onGameOver,
  onUpdateScore,
  onUpdateEnemiesLeft,
  onUpdateBossHealth,
  onUpdateTimeRemaining,
  score,
  level,
}) => {
  const [player, setPlayer] = useState({ x: 50, y: 90, width: 6, height: 3 });
  const [playerBullets, setPlayerBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [boss, setBoss] = useState(null);
  const [bossActive, setBossActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const levelConfig = LEVEL_CONFIG[level];
  const timerRef = useRef(null);
  const gameStateUpdateTimeout = useRef(null);

  const leftPressed = useKeyPress("ArrowLeft");
  const rightPressed = useKeyPress("ArrowRight");
  const spacePressed = useKeyPress(" ");

  const safeStateUpdate = useCallback((callback) => {
    if (gameStateUpdateTimeout.current) {
      clearTimeout(gameStateUpdateTimeout.current);
    }
    gameStateUpdateTimeout.current = setTimeout(callback, 0);
  }, []);

  useEffect(() => {
    initializeLevel();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (gameStateUpdateTimeout.current)
        clearTimeout(gameStateUpdateTimeout.current);
    };
  }, [level]);

  const initializeLevel = () => {
    const newEnemies = [];
    for (let row = 0; row < levelConfig.enemyRows; row++) {
      for (let col = 0; col < levelConfig.enemiesPerRow; col++) {
        const enemyWidth =
          level === 3 && levelConfig.enemySize
            ? levelConfig.enemySize.width
            : 6;

        const enemyHeight =
          level === 3 && levelConfig.enemySize
            ? levelConfig.enemySize.height
            : 3;

        newEnemies.push({
          id: generateUniqueId(`enemy-${row}-${col}-${level}`),
          x: 10 + col * (80 / levelConfig.enemiesPerRow),
          y: 10 + row * 8,
          width: enemyWidth,
          height: enemyHeight,
          direction: 1,
          type: row % 3,
        });
      }
    }
    setEnemies(newEnemies);

    safeStateUpdate(() => {
      onUpdateEnemiesLeft(newEnemies.length);
    });

    setPlayerBullets([]);
    setEnemyBullets([]);

    if (levelConfig.hasBoss) {
      const bossX = levelConfig.bossPosition
        ? levelConfig.bossPosition.x
        : 50 - levelConfig.bossSize.width / 2;

      const bossY = levelConfig.bossPosition ? levelConfig.bossPosition.y : 5;

      const bossConfig = {
        id: generateUniqueId(`boss-${level}`),
        x: bossX,
        y: bossY,
        width: levelConfig.bossSize.width,
        height: levelConfig.bossSize.height,
        direction: 1,
        health: levelConfig.bossHealth,
        maxHealth: levelConfig.bossHealth,
        approachTimer: 0,
        active: level === 3,
      };
      setBoss(bossConfig);
      setBossActive(level === 3);

      safeStateUpdate(() => {
        onUpdateBossHealth(bossConfig.health);
      });

      setTimeLeft(levelConfig.bossTimeLimit);

      safeStateUpdate(() => {
        onUpdateTimeRemaining(levelConfig.bossTimeLimit);
      });

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;

          safeStateUpdate(() => {
            onUpdateTimeRemaining(newTime);
          });
          return newTime;
        });
      }, 1000);
    } else {
      setBoss(null);
      setBossActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  useEffect(() => {
    if (leftPressed) {
      setPlayer((prev) => ({
        ...prev,
        x: Math.max(0, prev.x - 2),
      }));
    }

    if (rightPressed) {
      setPlayer((prev) => ({
        ...prev,
        x: Math.min(GAME_WIDTH - prev.width, prev.x + 2),
      }));
    }
  }, [leftPressed, rightPressed]);

  useEffect(() => {
    if (spacePressed && playerBullets.length < 3) {
      setPlayerBullets((prev) => [
        ...prev,
        {
          id: generateUniqueId("player-bullet"),
          x: player.x + player.width / 2 - 0.5,
          y: player.y - 1,
          width: 1,
          height: 2,
        },
      ]);
    }
  }, [spacePressed, player, playerBullets.length]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayerBullets((prev) =>
        prev
          .map((bullet) => ({ ...bullet, y: bullet.y - 2 }))
          .filter((bullet) => bullet.y > 0)
      );

      setEnemyBullets((prev) =>
        prev
          .map((bullet) => ({ ...bullet, y: bullet.y + 2 }))
          .filter((bullet) => bullet.y < GAME_HEIGHT)
      );

      setEnemies((prev) => {
        let reachedEdge = false;
        const updatedEnemies = prev.map((enemy) => {
          const newX = enemy.x + levelConfig.enemySpeed * enemy.direction;
          if (newX <= 0 || newX >= GAME_WIDTH - enemy.width) {
            reachedEdge = true;
          }
          return { ...enemy, x: newX };
        });

        if (reachedEdge) {
          return updatedEnemies.map((enemy) => ({
            ...enemy,
            direction: -enemy.direction,
            y: enemy.y + 2,
          }));
        }

        return updatedEnemies;
      });

      setEnemies((enemies) => {
        const newEnemyBullets = [];

        enemies.forEach((enemy) => {
          if (
            Math.random() < levelConfig.enemyShootChance &&
            enemyBullets.length + newEnemyBullets.length < 5
          ) {
            newEnemyBullets.push({
              id: generateUniqueId(`enemy-bullet-${enemy.id}`),
              x: enemy.x + enemy.width / 2 - 0.5,
              y: enemy.y + enemy.height,
              width: 1,
              height: 2,
              type: enemy.type,
            });
          }
        });

        if (newEnemyBullets.length > 0) {
          setEnemyBullets((prev) => [...prev, ...newEnemyBullets]);
        }

        return enemies;
      });

      if (boss && level === 3) {
        setBoss((prevBoss) => {
          if (!prevBoss) return null;

          if (!bossActive) return prevBoss;

          let newX = prevBoss.x + levelConfig.bossSpeed * prevBoss.direction;
          let newDirection = prevBoss.direction;

          if (newX <= 0 || newX >= GAME_WIDTH - prevBoss.width) {
            newDirection = -newDirection;
            newX = prevBoss.x + levelConfig.bossSpeed * newDirection;
          }

          let newY = prevBoss.y;
          if (timeLeft < levelConfig.bossTimeLimit) {
            const approachSpeed = (80 - prevBoss.y) / levelConfig.bossTimeLimit;
            newY =
              prevBoss.y +
              ((levelConfig.bossTimeLimit - timeLeft) * approachSpeed) / 60;
          }

          if (
            Math.random() < levelConfig.enemyShootChance * 3 &&
            enemyBullets.length < 8
          ) {
            const newBossBullets = [
              {
                id: generateUniqueId("boss-bullet-1"),
                x: prevBoss.x + prevBoss.width * 0.25,
                y: prevBoss.y + prevBoss.height,
                width: 1,
                height: 2,
                type: 3,
              },
              {
                id: generateUniqueId("boss-bullet-2"),
                x: prevBoss.x + prevBoss.width * 0.75,
                y: prevBoss.y + prevBoss.height,
                width: 1,
                height: 2,
                type: 3,
              },
            ];

            setEnemyBullets((prev) => [...prev, ...newBossBullets]);
          }

          return {
            ...prevBoss,
            x: newX,
            y: newY,
            direction: newDirection,
          };
        });
      }

      handleCollisions();
    }, 50);

    return () => clearInterval(gameLoop);
  }, [
    enemies,
    playerBullets,
    enemyBullets,
    player,
    boss,
    level,
    bossActive,
    levelConfig,
    timeLeft,
  ]);

  const handleCollisions = useCallback(() => {
    let hitEnemies = [];
    let bulletsToRemove = [];

    playerBullets.forEach((bullet) => {
      if (bulletsToRemove.includes(bullet.id)) {
        return;
      }

      let hasHitEnemy = false;
      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (checkCollision(bullet, enemy)) {
          hitEnemies.push(enemy.id);
          bulletsToRemove.push(bullet.id);

          onUpdateScore(10);
          console.log("Enemy hit! +10 points");
          hasHitEnemy = true;
          break;
        }
      }

      if (!hasHitEnemy && boss && bossActive && checkCollision(bullet, boss)) {
        bulletsToRemove.push(bullet.id);
        setBoss((prevBoss) => {
          if (!prevBoss) return null;

          const newHealth = prevBoss.health - 1;

          onUpdateBossHealth(newHealth);
          console.log("Boss hit! Health now:", newHealth);

          return {
            ...prevBoss,
            health: newHealth,
          };
        });

        onUpdateScore(5);
        console.log("Boss hit! +5 points");
      }
    });

    if (hitEnemies.length > 0) {
      setEnemies((prev) => {
        const updatedEnemies = prev.filter(
          (enemy) => !hitEnemies.includes(enemy.id)
        );

        onUpdateEnemiesLeft(updatedEnemies.length);
        console.log("Enemies left:", updatedEnemies.length);

        return updatedEnemies;
      });

      setPlayerBullets((prev) =>
        prev.filter((bullet) => !bulletsToRemove.includes(bullet.id))
      );
    } else if (bulletsToRemove.length > 0) {
      setPlayerBullets((prev) =>
        prev.filter((bullet) => !bulletsToRemove.includes(bullet.id))
      );
    }

    enemyBullets.forEach((bullet) => {
      if (checkCollision(bullet, player)) {
        console.log("Player hit by enemy bullet! Game Over!");
        onGameOver();
      }
    });

    enemies.forEach((enemy) => {
      if (enemy.y + enemy.height >= player.y || checkCollision(enemy, player)) {
        console.log("Player hit by enemy or enemy reached bottom! Game Over!");
        onGameOver();
      }
    });

    if (boss && bossActive) {
      if (checkCollision(boss, player)) {
        console.log("Player hit by boss! Game Over!");
        onGameOver();
      }

      if (boss.y + boss.height >= player.y) {
        console.log("Boss reached bottom! Game Over!");
        onGameOver();
      }
    }
  }, [
    enemies,
    playerBullets,
    enemyBullets,
    player,
    boss,
    bossActive,
    onGameOver,
    onUpdateScore,
    onUpdateEnemiesLeft,
    onUpdateBossHealth,
  ]);

  const skipLevel = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setEnemies([]);

    safeStateUpdate(() => {
      onUpdateEnemiesLeft(0);
    });
  };

  const killBoss = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setBoss((prevBoss) => {
      if (!prevBoss) return null;

      safeStateUpdate(() => {
        onUpdateBossHealth(0);
      });

      return {
        ...prevBoss,
        health: 0,
      };
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="mb-4 text-white flex justify-between w-[500px]">
        <span>Level: {level}</span>
        <span>Result: {score}</span>
        {level === 3 ? (
          <span className="text-yellow-300 font-bold">
            Goal: Destroy the boss!
          </span>
        ) : (
          <span>Enemies: {enemies.length}</span>
        )}
        {boss && (
          <span>
            Boss Health:{" "}
            {boss.health !== undefined && typeof boss.health === "number"
              ? boss.health
              : 0}
          </span>
        )}
        {level === 3 && (
          <span className="text-red-500">
            Time Remaining: {typeof timeLeft === "number" ? timeLeft : 0}s
          </span>
        )}
      </div>

      <div
        className="relative bg-gray-900 border-2 border-gray-700 mx-auto"
        style={{ width: "500px", height: "500px" }}
      >
        <Player position={player} />

        {playerBullets.map((bullet) => (
          <Bullet key={bullet.id} position={bullet} type="player" />
        ))}

        {enemies.map((enemy) => (
          <Enemy
            key={enemy.id}
            position={enemy}
            type={enemy.type}
            level={level}
          />
        ))}

        {enemyBullets.map((bullet) => (
          <Bullet
            key={bullet.id}
            position={bullet}
            type={`enemy-${bullet.type || 0}`}
          />
        ))}

        {boss && bossActive && (
          <Boss
            position={boss}
            health={boss.health}
            maxHealth={boss.maxHealth}
          />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between w-[500px]">
        <div className="text-gray-400 text-sm">
          <p>Controls: Left and right arrows to move, Space to shoot</p>
        </div>
        <div className="flex space-x-2">
          {level < 3 && (
            <button
              onClick={skipLevel}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition-colors"
            >
              Skip this level
            </button>
          )}

          {level === 3 && boss && bossActive && (
            <button
              onClick={killBoss}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors"
            >
              Kill the boss immediately
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
