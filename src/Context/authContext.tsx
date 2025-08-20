import React, { createContext, useState } from "react";

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    refreshToken: string | null;
    setRefreshToken: (token: string | null) => void;
    userInfo: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    } | null;
    setUserInfo: (user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    } | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    setToken: () => { },
    refreshToken: null,
    setRefreshToken: () => { },
    userInfo: null,
    setUserInfo: () => { }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    } | null>(null);
    return (
        <AuthContext.Provider value={{ token, setToken, refreshToken, setRefreshToken, userInfo, setUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;