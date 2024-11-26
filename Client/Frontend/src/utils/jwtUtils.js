export const isUserLoggedInWithRole = (requiredRole) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const userRole = localStorage.getItem("userRole");
    return accessToken && (requiredRole === "ANY" || userRole === requiredRole);
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
};
