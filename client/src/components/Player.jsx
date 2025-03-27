import ship from "../../public/ship.png";

const Player = ({ position }) => {
  return (
    <div
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${position.width}%`,
        height: `${position.height}%`,
        backgroundImage: `url(${ship})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transform: "scale(3)",
      }}
    />
  );
};

export default Player;
