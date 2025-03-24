import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthScreen = ({ onAuthSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleLogin = () => {
    onAuthSuccess();
  };

  const handleRegister = () => {
    onAuthSuccess();
  };

  const switchToLogin = () => {
    setIsLoginMode(true);
  };

  const switchToRegister = () => {
    setIsLoginMode(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black py-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="absolute w-1 h-1 bg-green-500 rounded-full opacity-30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: "0 0 8px 2px rgba(34, 197, 94, 0.3)",
                animation: `twinkle ${2 + Math.random() * 3}s infinite ${
                  Math.random() * 2
                }s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="text-center mb-10 z-10">
        <h1 className="text-5xl font-bold text-green-400 mb-6 drop-shadow-lg">
          Space Invaders
        </h1>
        <p className="text-xl text-white">
          Log in or register to start the game
        </p>
      </div>

      <div className="w-full max-w-4xl z-10">
        {isLoginMode ? (
          <Login onLogin={handleLogin} onSwitchToRegister={switchToRegister} />
        ) : (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={switchToLogin}
          />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
