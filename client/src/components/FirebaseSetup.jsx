import { useState } from "react";

const FirebaseSetup = ({ onSetupComplete }) => {
  const [apiKey, setApiKey] = useState("");
  const [authDomain, setAuthDomain] = useState("");
  const [projectId, setProjectId] = useState("");
  const [storageBucket, setStorageBucket] = useState("");
  const [messagingSenderId, setMessagingSenderId] = useState("");
  const [appId, setAppId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !apiKey ||
        !authDomain ||
        !projectId ||
        !storageBucket ||
        !messagingSenderId ||
        !appId
      ) {
        setError("All fields are required!");
        return;
      }

      const firebaseConfig = {
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
      };

      localStorage.setItem("firebaseConfig", JSON.stringify(firebaseConfig));

      setSuccess(true);

      setTimeout(() => {
        onSetupComplete();
      }, 1500);
    } catch (err) {
      console.error("Firebase initialization error:", err);
      setError(
        "Firebase initialization error: " + (err.message || "Unknown error")
      );
    }
  };

  const handleUseTestConfig = () => {
    setApiKey("demo-api-key");
    setAuthDomain("demo-project.firebaseapp.com");
    setProjectId("demo-project");
    setStorageBucket("demo-project.appspot.com");
    setMessagingSenderId("123456789");
    setAppId("1:123456789:web:abcdef123456");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="bg-gray-800 p-6 rounded-lg text-white max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Firebase Configuration</h2>

        {success ? (
          <div className="bg-green-600 p-4 rounded mb-4">
            <p>Firebase configuration successful! Redirecting...</p>
          </div>
        ) : (
          <>
            <p className="mb-4">
              To use Firebase authentication, enter your Firebase credentials
              below. You can find them in the Firebase Console.
            </p>

            {error && (
              <div className="bg-red-700 p-3 rounded mb-4">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">API Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Auth Domain</label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Project ID</label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Storage Bucket</label>
                <input
                  type="text"
                  value={storageBucket}
                  onChange={(e) => setStorageBucket(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Messaging Sender ID
                </label>
                <input
                  type="text"
                  value={messagingSenderId}
                  onChange={(e) => setMessagingSenderId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">App ID</label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Configuration
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleUseTestConfig}
                  className="text-blue-400 hover:underline text-sm"
                >
                  Use test configuration (for demonstration only)
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FirebaseSetup;
