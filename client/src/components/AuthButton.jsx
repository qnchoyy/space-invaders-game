import React from "react";
import { logoutUser } from "../firebase/auth";

const AuthButton = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await logoutUser();
      if (onLogout) onLogout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-300">{user.email}</span>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default AuthButton;
