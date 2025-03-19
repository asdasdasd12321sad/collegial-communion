
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cendy-gray p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-6xl font-bold text-cendy-blue">404</h1>
        <p className="mb-6 text-xl text-cendy-text">Oops! Page not found</p>
        <button 
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 rounded-xl bg-cendy-blue px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-cendy-blue-dark"
        >
          <ArrowLeft size={18} />
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
