import { SignIn } from './components/auth/SignIn'
import Home from './components/Home';
import { Routes, Route } from 'react-router-dom';
import { auth } from './config/firebase';
import { useState, useEffect } from 'react'


function App() {

  const [user, setUser] = useState(null)

  useEffect(() => {
    setUser(auth.currentUser)
  })




  if (user === null)  return <SignIn setUser={setUser} />



  return (
    <div>
      <Routes>
        <Route path="/" element={<Home setUser={setUser} />} />
      </Routes>
    </div>
  );
}

export default App;
