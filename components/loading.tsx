import React from "react";

interface LoadingProps {
  size?: "small" | "medium" | "large";
}

const Loading: React.FC<LoadingProps> = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-16 w-16",
    large: "h-32 w-32",
  };

  return (
    <div className="flex-1 w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-[hsl(var(--primary))] ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export default Loading;
