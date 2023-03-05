import { SignIn } from './components/auth/SignIn'
import Home from './components/Home';
import { Routes, Route } from 'react-router-dom';
import { useContext} from 'react'
import { UserContext } from './contexts/user'



function App() {

  const { user } = useContext(UserContext)

  if (user === null)  return <SignIn  />


  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
