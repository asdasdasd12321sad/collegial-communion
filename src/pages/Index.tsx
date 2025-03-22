
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the home page immediately
    navigate("/home", { replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cendy-gray">
      <div className="animate-pulse text-center">
        <h1 className="text-2xl font-bold text-cendy-blue">Redirecting...</h1>
      </div>
    </div>
  );
};

export default Index;
