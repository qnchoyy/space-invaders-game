const Player = ({ position }) => {
  return (
    <div
      className="absolute bg-green-500"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${position.width}%`,
        height: `${position.height}%`,
      }}
    />
  );
};

export default Player;
