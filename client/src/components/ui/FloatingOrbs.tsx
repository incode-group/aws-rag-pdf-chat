const FloatingOrbs = () => (
  <div className="pointer-events-none fixed inset-0 z-0">
    <div
      className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-purple-300 to-blue-300 opacity-60 animate-float-slow animate-pulse-glow animate-gradient"
      style={{ filter: "blur(32px)" }}
    />
    <div
      className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-gradient-to-tr from-blue-200 to-purple-200 opacity-50 animate-float-medium animate-pulse-glow animate-gradient"
      style={{ filter: "blur(24px)" }}
    />
    <div
      className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-gradient-to-tl from-purple-400 to-blue-200 opacity-40 animate-float-fast animate-pulse-glow animate-gradient"
      style={{ filter: "blur(20px)" }}
    />
    <div
      className="absolute top-1/4 right-1/4 w-28 h-28 rounded-full bg-gradient-to-br from-blue-300 to-purple-200 opacity-50 animate-float-slow animate-pulse-glow animate-gradient"
      style={{ filter: "blur(28px)" }}
    />
    <div
      className="absolute bottom-10 left-1/3 w-20 h-20 rounded-full bg-gradient-to-tr from-purple-200 to-blue-100 opacity-40 animate-float-medium animate-pulse-glow animate-gradient"
      style={{ filter: "blur(18px)" }}
    />
    <div
      className="absolute top-1/3 right-10 w-36 h-36 rounded-full bg-gradient-to-tl from-blue-400 to-purple-300 opacity-30 animate-float-fast animate-pulse-glow animate-gradient"
      style={{ filter: "blur(30px)" }}
    />
    <div
      className="absolute bottom-1/4 left-20 w-24 h-24 rounded-full bg-gradient-to-br from-purple-300 to-blue-200 opacity-50 animate-float-slow animate-pulse-glow animate-gradient"
      style={{ filter: "blur(22px)" }}
    />
    <div
      className="absolute top-16 right-1/2 w-16 h-16 rounded-full bg-gradient-to-tr from-blue-200 to-purple-100 opacity-40 animate-float-medium animate-pulse-glow animate-gradient"
      style={{ filter: "blur(14px)" }}
    />
    <div
      className="absolute bottom-1/2 left-1/4 w-28 h-28 rounded-full bg-gradient-to-tl from-purple-400 to-blue-300 opacity-30 animate-float-fast animate-pulse-glow animate-gradient"
      style={{ filter: "blur(26px)" }}
    />
    <div
      className="absolute top-1/5 right-1/5 w-20 h-20 rounded-full bg-gradient-to-br from-blue-300 to-purple-200 opacity-50 animate-float-slow animate-pulse-glow animate-gradient"
      style={{ filter: "blur(18px)" }}
    />
  </div>
);

export default FloatingOrbs;
