import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";

const UrlContext = createContext();

const UrlProvider = ({ children }) => {
  // Use state directly for user and authentication status
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Use useFetch for the getCurrentUser function
  const { fn: fetchUserData } = useFetch(getCurrentUser);
  
  // Create a fetchUser function that updates our state
  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await fetchUserData();
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(userData.role === "authenticated");
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UrlContext.Provider
      value={{
        user,
        fetchUser,
        loading,
        isAuthenticated,
        logout: handleLogout
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => {
  return useContext(UrlContext);
};

export default UrlProvider;