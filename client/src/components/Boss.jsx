const Boss = ({ position, health, maxHealth }) => {
  const healthPercentage = (health / maxHealth) * 100;

  return (
    <div>
      <div
        className="absolute bg-red-700"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          width: `${position.width}%`,
          height: `${position.height}%`,
          border: "2px solid #ff0000",
          boxShadow: "0 0 10px #ff0000",
        }}
      >
        <div
          className="absolute bg-yellow-300"
          style={{ width: "20%", height: "20%", left: "20%", top: "30%" }}
        />
        <div
          className="absolute bg-yellow-300"
          style={{ width: "20%", height: "20%", right: "20%", top: "30%" }}
        />

        <div
          className="absolute bg-black"
          style={{ width: "60%", height: "15%", left: "20%", bottom: "20%" }}
        />
      </div>

      <div
        className="absolute bg-gray-700"
        style={{
          left: `${position.x}%`,
          top: `${position.y - 5}%`,
          width: `${position.width}%`,
          height: "2%",
        }}
      >
        <div
          className="absolute bg-red-500 h-full"
          style={{
            width: `${healthPercentage}%`,
          }}
        />
      </div>
    </div>
  );
};

export default Boss;
