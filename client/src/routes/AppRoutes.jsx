import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Game from "../components/Game";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import { authStateListener } from "../firebase/auth";

const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authStateListener((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Game user={user} /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <Register />}
      />
    </Routes>
  );
};

export default AppRoutes;
