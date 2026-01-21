import React from 'react';

const Logo = ({ size = "md", showText = true }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} bg-emerald-600 rounded-xl flex items-center justify-center`}>
        <svg className="h-2/3 w-2/3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
          <path d="M2 17L12 22L22 17" />
          <path d="M2 12L12 17L22 12" />
        </svg>
      </div>
      {showText && (
        <span className={`font-bold text-slate-900 ${
          size === "sm" ? "text-lg" :
          size === "md" ? "text-xl" :
          "text-2xl"
        }`}>
          MediCare
        </span>
      )}
    </div>
  );
};

export default Logo;
