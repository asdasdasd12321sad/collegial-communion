
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Redirect to the appropriate page based on authentication status
      if (user) {
        navigate("/home", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, user, loading]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cendy-gray">
      <div className="animate-pulse text-center">
        <h1 className="text-2xl font-bold text-cendy-blue">Redirecting...</h1>
      </div>
    </div>
  );
};

export default Index;
