import { auth, db } from '../config/firebase';
import { collection,getDocs } from 'firebase/firestore';
import { useState, useEffect, createContext } from 'react'

const UserContext = createContext(null)

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [labels, setLabels] = useState([])
    const priorities = [{name: 'High', color:'red-500'}, {name: 'Medium', color:'yellow-300'}, {name: 'Low', color:'green-300'}]
    
    useEffect(() => {
        const unsubscribe = auth?.onAuthStateChanged((user) => {
        setUser(user);
        });
    
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchLabels = async () => {
          const labelsRef = collection(db, 'labels')
          const labelsSnapshot = await getDocs(labelsRef)
          const labelsList = labelsSnapshot.docs.map(doc =>({...doc.data(), id: doc.id}))
          setLabels(labelsList)
        }
        fetchLabels()
      }, [])
    
      console.log(labels)
    
    return (
        <UserContext.Provider value={{ user, setUser , labels, setLabels, priorities }}>
        {children}
        </UserContext.Provider>
    );
    }

export { UserContext, UserProvider }






