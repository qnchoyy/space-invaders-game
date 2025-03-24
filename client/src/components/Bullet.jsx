import React from "react";

const Bullet = ({ position, type }) => {
  let bulletClass = "absolute ";

  switch (type) {
    case "player":
      bulletClass += "bg-blue-500";
      break;
    case "enemy-0":
      bulletClass += "bg-red-500";
      break;
    case "enemy-1":
      bulletClass += "bg-purple-500";
      break;
    case "enemy-2":
      bulletClass += "bg-orange-500";
      break;
    case "enemy-3":
      bulletClass += "bg-yellow-300";
      break;
    default:
      bulletClass += "bg-white";
  }

  return (
    <div
      className={bulletClass}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${position.width}%`,
        height: `${position.height}%`,
        boxShadow: type === "enemy-3" ? "0 0 5px #ffff00" : "none",
        border: type === "enemy-3" ? "1px solid #ff0000" : "none",
      }}
    />
  );
};

export default Bullet;
