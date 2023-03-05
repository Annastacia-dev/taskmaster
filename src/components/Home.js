import NavBar from './NavBar';
import { auth } from '../config/firebase'
import { signOut } from "firebase/auth";

const Home = ({ setUser }) => {



  return (
    <div className="flex flex-col h-screen">
        <NavBar setUser={setUser} />
        <h1>Home</h1>

    </div>
  )
}

export default Home