import { create } from "zustand";

const expiryTime = 30 * 60 * 1000;

function setWithExpiry(key, value, ttl) {
  const now = new Date();
  const item = { value, expiry: now.getTime() + ttl };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  if (new Date().getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
}

export const useAuthStore = create((set) => ({
  token: getWithExpiry("token"),
  userId: getWithExpiry("userId"),
  userRole: getWithExpiry("userRole"),
  error: null,

  setToken: (token) => {
    set({ token });
    setWithExpiry("token", token, expiryTime);
  },

  setUserId: (userId) => {
    set({ userId });
    setWithExpiry("userId", userId, expiryTime);
  },
  setUserRole: (userRole) => {
    set({ userRole });
    setWithExpiry("userRole", userRole, expiryTime);
  },

  clearAuth: () => {
    set({ token: null, userId: null, userRole: null, error: null });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
  },

  setError: (error) => set({ error }),
}));
