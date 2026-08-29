interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${iconSizes[size]}`}>
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
          <circle cx="15" cy="24" r="5.5" fill="#FF6B6B" />
          <circle cx="33" cy="24" r="5.5" fill="#4ECDC4" />
          <path
            d="M20.5 24C20.5 20 24 17.5 24 17.5C24 17.5 27.5 20 27.5 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
      {showText && (
        <span className={`font-bold ${textSizes[size]} tracking-tight`}>
          duo
        </span>
      )}
    </div>
  );
}
