import React, { ReactNode, createContext, useContext, useEffect, useState, useCallback } from 'react'

import authLink from '../services/spotify/spotifyAuthLink'

import { TTokenContextValue, TSpotifyTokenData } from '@/types/General';

// Create context.
const TokenContext = createContext<TTokenContextValue | undefined>(undefined);

// Hook.
export const useToken = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
}

// Provider.
export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tokenInfo, setTokenInfo] = useState<TSpotifyTokenData | null>(() => {
    // Tries to get the token from localStorage on initial render.
    const storedToken = localStorage.getItem('spotifyTokenInfo');
    if (storedToken) {
      try {
        const parsedToken: TSpotifyTokenData = JSON.parse(storedToken);
        const now = Date.now();
        const expiresAt = parsedToken.obtainedAt + (parsedToken.expiresIn * 1000);
        if (now < expiresAt) {
          return parsedToken;
        } else {
          localStorage.removeItem('spotifyTokenInfo');
          return null;
        }
      } catch (e) {
        console.error("Failed to parse token from localStorage", e);
        localStorage.removeItem('spotifyTokenInfo');
        return null;
      }
    }
    return null;
  });

  // Usamos useCallback para memoizar as funções e evitar renderizações desnecessárias
  const logout = useCallback(() => {
    localStorage.removeItem('spotifyTokenInfo');
    setTokenInfo(null);
  }, []);

  const setToken = useCallback((newToken: TSpotifyTokenData | null) => {
    if (newToken) {
      const tokenWithObtainedAt = { ...newToken, obtainedAt: newToken.obtainedAt || Date.now() };
      localStorage.setItem('spotifyTokenInfo', JSON.stringify(tokenWithObtainedAt));
      setTokenInfo(tokenWithObtainedAt);
    } else {
      localStorage.removeItem('spotifyTokenInfo');
      setTokenInfo(null);
    }
  }, []);

  // Lógica para isValid baseada no tokenInfo
  const isValid = React.useMemo(() => {
    if (!tokenInfo || !tokenInfo.accessToken) {
      return false;
    }
    const now = Date.now();
    const expiresAt = tokenInfo.obtainedAt + (tokenInfo.expiresIn * 1000);

    return now < expiresAt;
  }, [tokenInfo]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (tokenInfo && isValid) {
      const expiresAt = tokenInfo.obtainedAt + (tokenInfo.expiresIn * 1000);
      const timeUntilExpire = expiresAt - Date.now();

      if (timeUntilExpire > 0) {
        timer = setTimeout(() => {
          console.log("Spotify token expired by timer. Logging out.");
          logout();
        }, timeUntilExpire);
      } else {
        console.log("Spotify token already expired on load. Logging out.");
        logout();
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [tokenInfo, isValid, logout]);


  const contextValue = React.useMemo(() => ({
    tokenInfo,
    setToken,
    isValid,
    authLink,
    logout,
  }), [tokenInfo, setToken, isValid, logout]);


  return <TokenContext.Provider value={contextValue}>{children}</TokenContext.Provider>
}