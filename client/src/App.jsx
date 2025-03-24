import { useState, useEffect } from "react";
import FirebaseSetup from "./components/FirebaseSetup";
import { firebaseConfig } from "./firebase/firebaseConfig";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [needsFirebaseSetup, setNeedsFirebaseSetup] = useState(false);

  useEffect(() => {
    const preventSpaceScroll = (e) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", preventSpaceScroll);

    const hasValidConfig =
      firebaseConfig &&
      firebaseConfig.apiKey &&
      firebaseConfig.apiKey !== "YOUR_API_KEY";

    if (!hasValidConfig) {
      setNeedsFirebaseSetup(true);
    }

    return () => {
      window.removeEventListener("keydown", preventSpaceScroll);
    };
  }, []);

  const handleFirebaseSetupComplete = () => {
    setNeedsFirebaseSetup(false);

    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  if (needsFirebaseSetup) {
    return <FirebaseSetup onComplete={handleFirebaseSetupComplete} />;
  }

  return (
    <Router>
      <div className="min-h-screen w-full bg-black bg-[radial-gradient(white,rgba(255,255,255,0.2)_2px,transparent_10px),radial-gradient(white,rgba(255,255,255,0.15)_1px,transparent_5px)] bg-[length:50px_50px,30px_30px] bg-[position:0_0,15px_15px] overflow-hidden fixed inset-0">
        <main className="relative mx-auto max-w-7xl px-4 py-8 h-screen">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
