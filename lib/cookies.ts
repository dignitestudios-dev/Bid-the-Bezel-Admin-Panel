const TOKEN_KEY = "token";
const USER_KEY = "admin";

// SET cookie
export const setToken = (token: string) => {
  if (typeof document === "undefined") return;

  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=Lax`;
};

// GET cookie
export const getToken = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split("; ");

  const tokenCookie = cookies.find((row) => row.startsWith(`${TOKEN_KEY}=`));

  return tokenCookie ? tokenCookie.split("=")[1] : null;
};
export const setUser = (user: any) => {
  if (typeof document === "undefined") return;

  document.cookie = `${USER_KEY}=${encodeURIComponent(
    JSON.stringify(user),
  )}; path=/; max-age=86400; SameSite=Lax`;
};
export const getUser = () => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split("; ");

  const userCookie = cookies.find((row) => row.startsWith(`${USER_KEY}=`));

  if (!userCookie) return null;

  return JSON.parse(decodeURIComponent(userCookie.split("=")[1]));
};
// REMOVE cookie
export const removeToken = () => {
  if (typeof document === "undefined") return;

  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  document.cookie = `${USER_KEY}=; path=/; max-age=0`;
};
