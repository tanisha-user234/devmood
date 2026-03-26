'use client'
import { authApi } from '@/lib/api';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string| null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('devmood_token');
    if (savedToken) {
      setToken(savedToken)
      authApi.getMe()
        .then(({ user }) => setUser(user))
        .catch(() => {
          //remove invalid or expire token from the user storage
          localStorage.removeItem('devmood_token')
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [])

  const register = async (name: string, email: string, password: string) => {
    const { token: newToken, user: newUser } = await authApi.register({ name, email, password });
    localStorage.setItem('devmood_token', newToken);
    document.cookie = `devmood_token=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}`
    setToken(newToken);
    setUser(newUser);
  }

  const login= async (email:string,password:string)=>{
    const {token:newToken, user:newUser}=await authApi.login({email,password});
    localStorage.setItem('devmood_token',newToken);
        document.cookie = `devmood_token=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}`

    setToken(newToken);
    setUser(newUser);
  }

  const logout=()=>{
    localStorage.removeItem('devmood_token');
    document.cookie = 'devmood_token=; path=/; max-age=0'
    setToken(null);
    setUser(null);
  }
 return(
    <AuthContext.Provider value={{user,token,login,register,logout,loading}}>
        {children}
    </AuthContext.Provider>
 )
}

export function useAuth(){
    const context=useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be within an AuthProvider');
    }
    return context;
}


