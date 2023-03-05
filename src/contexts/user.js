import { auth } from '../config/firebase';
import { useState, useEffect, createContext } from 'react'

const UserContext = createContext(null)

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
        });
    
        return () => unsubscribe();
    }, []);
    
    return (
        <UserContext.Provider value={{ user, setUser }}>
        {children}
        </UserContext.Provider>
    );
    }

export { UserContext, UserProvider }






