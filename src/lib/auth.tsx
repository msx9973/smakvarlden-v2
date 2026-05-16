import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../store';
import { store } from '../store';

interface AuthCtx { user: User | null; login: (e:string,p:string)=>void; register:(n:string,e:string,p:string)=>void; logout:()=>void; }
const Ctx = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(store.getUser());
  return (
    <Ctx.Provider value={{
      user,
      login:    (e,p)   => setUser(store.login(e,p)),
      register: (n,e,p) => setUser(store.register(n,e,p)),
      logout:   ()      => { store.logout(); setUser(null); },
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
