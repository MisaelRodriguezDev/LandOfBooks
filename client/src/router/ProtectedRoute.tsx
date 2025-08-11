import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import LoadingScreen from "@/components/ui/LoadingScreen/LoadingScreen";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login", { replace: true });
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        navigate("/unauthorized", { replace: true });
      }
    }
  }, [user, loading, navigate, allowedRoles]);

  if (loading) return <LoadingScreen />;

  return user ? <Outlet /> : null;
};

export default ProtectedRoute;
