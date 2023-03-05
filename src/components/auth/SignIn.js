import { useState } from 'react'
import { auth, googleProvider } from '../../config/firebase'
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Logo from '../Logo';
import { SignUp } from './SignUp';
import { FcGoogle } from 'react-icons/fc'
import Loading from '../Loading';



export const SignIn = ({ setUser }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showSignIn, setShowSignIn] = useState(true)
    const [loading, setLoading] = useState(false)

    console.log(auth)
   

    const handleSignIn = async () => {
      try{
        setLoading(true)
       await signInWithEmailAndPassword(auth, email, password)
       setUser(auth.currentUser)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }

    const signInWithGoogle = async () => {
      try{
        setLoading(true)
        await signInWithPopup(auth,googleProvider)
        setUser(auth.currentUser)
        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }

    if(loading) return <Loading />

  

  return (
    <>
    {
      showSignIn ? (
        <div className='flex flex-col gap-3 justify-center items-center w-screen h-screen bg-gradient-to-r from-blue-900 to-blue-500 '>
            <Logo />
            <input placeholder='Enter your email' value={email} type="text" onChange={e => setEmail(e.target.value)} className='border-b-2 bg-transparent placeholder:text-center placeholder:text-white placeholder:text-sm  border-blue-200 p-2 focus:outline-none focus:border-yellow-300 focus:placeholder:text-transparent focus:text-center caret-white focus:text-white text-center text-white' />
            <input placeholder='Enter your password' type="password"  value={password} onChange={e => setPassword(e.target.value)} className='border-b-2 bg-transparent placeholder:text-center placeholder:text-white placeholder:text-sm  border-blue-200 p-2 focus:outline-none focus:border-yellow-300 focus:placeholder:text-transparent focus:text-center caret-white focus:text-white text-center text-white' />
    
            <button className='bg-yellow-300 text-blue-900 font-bold py-2 px-6 mt-5 rounded hover:text-yellow-300 hover:bg-blue-900' onClick={handleSignIn}>Sign In</button> 

            <hr className='border-1 border-blue-200 w-1/2' />
            <p className='text-white text-sm'>Or sign in with</p>
            <button className='bg-yellow-300  font-bold py-2 px-6 mt-5 rounded hover:bg-blue-900' onClick={signInWithGoogle}><FcGoogle/></button>

            <p className='text-white text-sm mt-3'>Don't have an account? <span className='text-yellow-300 cursor-pointer' onClick={() => setShowSignIn(false)}>Sign Up</span></p>

         </div>
      ) : (
        
        <SignUp setShowSignIn={setShowSignIn} setUser={setUser} />
      )
    }
    </>
  


   
  )
}


