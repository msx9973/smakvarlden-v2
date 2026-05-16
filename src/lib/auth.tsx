import { useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../store';
import { store } from '../store';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(store.getUser());
  return (
    <AuthContext.Provider value={{
      user,
      login:    (e,p)   => setUser(store.login(e,p)),
      register: (n,e,p) => setUser(store.register(n,e,p)),
      logout:   ()      => { store.logout(); setUser(null); },
    }}>
      {children}
    </AuthContext.Provider>
  );
}
