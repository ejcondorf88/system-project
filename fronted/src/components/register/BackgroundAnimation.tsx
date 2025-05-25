export const BackgroundAnimation = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -inset-10 opacity-50">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div
        className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        style={{ animationDelay: "4s" }}
      ></div>
    </div>
  </div>
); 