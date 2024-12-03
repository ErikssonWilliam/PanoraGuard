import { getWithExpiry } from "./useAuthStore";

export const isUserLoggedInWithRole = (requiredRole) => {
  try {
    const token = getWithExpiry("token");
    const userRole = getWithExpiry("userRole");
    return token && (requiredRole === "ANY" || userRole === requiredRole);
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
};
