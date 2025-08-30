import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (user) return ;

    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        console.log('🔍 Fetching user profile...');
        console.log('🔍 API URL:', API_PATHS.AUTH.GET_PROFILE);
        console.log('🔍 Token exists:', !!accessToken);
        
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        
        console.log('📦 Full API Response:', response);
        console.log('📦 Response data:', response.data);
        console.log('📦 Response status:', response.status);
        
        // Handle different response structures
        let userData = null;
        
        if (response.data.user) {
          console.log('🎯 Found userData in response.data.user');
          userData = response.data.user;
        } else if (response.data.id || response.data.email) {
          console.log('🎯 Found userData directly in response.data');
          userData = response.data;
        } else if (response.data.data) {
          console.log('🎯 Found userData in response.data.data');
          userData = response.data.data.user || response.data.data;
        }
        
        console.log('🔍 Final userData:', userData);
        console.log('🔍 userData type:', typeof userData);
        console.log('🔍 userData keys:', userData ? Object.keys(userData) : 'N/A');
        
        if (userData) {
          const finalUserData = {
            ...userData,  
            token: accessToken
          };
          
          console.log('🔍 Final user data to be passed to updateUser:', finalUserData);
          console.log('🔍 Final user data keys:', Object.keys(finalUserData));
          
          console.log('✅ User data found, calling updateUser');
          updateUser(finalUserData);
        } else {
          console.warn('❌ No user data found in response');
          console.log('Available response keys:', Object.keys(response.data || {}));
          clearUser();
        }
      } catch (error) {
        console.error("User fetch failed:", error);
        
        if (error.response) {
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        }
        
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData) => {
    console.log('🔍 updateUser called from:', new Error().stack);
    
    if (!userData) {
      console.warn('updateUser called with undefined data');
      console.trace('Stack trace for undefined call:'); // This will show the call stack
      return;
    }
    
    console.log('✅ Valid userData received:', userData);
    setUser(userData);
    
    // Only set token if it exists in userData
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('token');
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
