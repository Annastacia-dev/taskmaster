import { useState, useEffect } from "react";
import Logo from "./Logo";

const LoadingBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress(progress + 10);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <Logo />
      <div className="h-1 w-1/3 bg-gray-200 rounded-full">
        <div
          className="h-full bg-yellow-300 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingBar;
