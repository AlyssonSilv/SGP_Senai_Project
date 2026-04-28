import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

export interface EmpresaUsuario {
  id: number;
  razaoSocial: string;
  cnpj: string;
  email: string;
  role: string;
}


interface AuthContextType {
  usuario: EmpresaUsuario | null;
  loading: boolean;
  setUsuario: (usuario: EmpresaUsuario | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<EmpresaUsuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const carregarUsuario = async () => {
      try {
        
        const response = await api.get('/login/me');
        setUsuario(response.data);
      } catch (error) {
        
        setUsuario(null);
      } finally {
        
        setLoading(false);
      }
    };

    carregarUsuario();
  }, []);

  const logout = async () => {
    try {
      
      setUsuario(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, setUsuario, logout }}>
      {children}
    </AuthContext.Provider>
  );
};