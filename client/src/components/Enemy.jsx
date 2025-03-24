const Enemy = ({ position, type, level }) => {
  let enemyClass = "absolute ";

  if (level === 3) {
    enemyClass += "bg-orange-300 border border-red-600 shadow-lg ";

    enemyClass += "animate-pulse ";
  } else {
    switch (type) {
      case 0:
        enemyClass += "bg-red-500";
        break;
      case 1:
        enemyClass += "bg-purple-500";
        break;
      case 2:
        enemyClass += "bg-orange-500";
        break;
      default:
        enemyClass += "bg-red-500";
    }
  }

  return (
    <div
      className={enemyClass}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${position.width}%`,
        height: `${position.height}%`,
      }}
    />
  );
};

export default Enemy;
