import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/auth";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      let errorMessage = "";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/user-not-found":
          errorMessage = "No user found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/invalid-login-credentials":
          errorMessage = "Invalid email or password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many login attempts. Please try again later";
          break;
        default:
          errorMessage = "An error occurred during login. Please try again";
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full py-8 px-4 overflow-hidden">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-green-400 font-mono uppercase tracking-wider mb-4 shadow-[0_0_5px_#4ade80,0_0_10px_#4ade80]">
          Space Invaders
        </h1>
        <p className="text-xl text-white">
          Log in or register to start the game
        </p>
      </div>

      <div className="flex flex-col items-center justify-center p-8 bg-gray-800/90 rounded-lg shadow-xl max-w-md w-full mx-auto backdrop-blur-sm border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-green-400">Login</h2>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-colors"
              placeholder="********"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-md p-4 text-red-400">
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded transition-colors duration-200 relative overflow-hidden shadow-lg shadow-green-500/20 hover:-translate-y-0.5 hover:shadow-[0_0_8px_#4ade80] after:content-[''] after:absolute after:top-0 after:left-[-100%] after:w-full after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-green-400 after:to-transparent after:animate-[shimmer_1.5s_linear_infinite]"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
