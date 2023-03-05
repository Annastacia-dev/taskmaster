import { useState, useContext } from 'react'
import { auth, googleProvider } from '../../config/firebase'
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Logo from '../Logo';
import { SignUp } from './SignUp';
import { FcGoogle } from 'react-icons/fc'
import Loading from '../Loading';
import { UserContext } from '../../contexts/user'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




export const SignIn = () => {

    const { setUser } = useContext(UserContext)


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showSignIn, setShowSignIn] = useState(true)
    const [loading, setLoading] = useState(false)
    const [emailErrors, setEmailErrors] = useState([])
    const [passwordErrors, setPasswordErrors] = useState([])

    const toastStyle = {
      position : 'top-center',
      autoClose : 3000,
      hideProgressBar : true,
      closeOnClick : true,
      pauseOnHover : true,
      draggable : true,
      progress : undefined,
      theme: 'colored'
    }


    const handleSignIn = async () => {
      try{
        setLoading(true)
       await signInWithEmailAndPassword(auth, email, password)
       setUser(auth.currentUser)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        if (error.code === 'auth/user-not-found') {
          toast.error('Invalid email', toastStyle)
        } else if (error.code === 'auth/wrong-password') {
          toast.error('Invalid password', toastStyle)
        } else {
          toast.error('SignIn failed', toastStyle)
        }
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

    //validate email, cannot be empty, must be valid email
    const validateEmail = (email) => {
      const re = /\S+@\S+\.\S+/;
      if (email === '') {
        setEmailErrors(['Email cannot be empty'])
      } else if (!re.test(email)) {
        setEmailErrors(['Email is invalid'])
      } else {
        setEmailErrors([])
      }  
    }

    //validate password, cannot be empty, 6 characters
    const validatePassword = (password) => {
      if (password === '') {
        setPasswordErrors(['Password cannot be empty'])
      }
      else if (password.length < 6) {
        setPasswordErrors(['Password must be at least 6 characters'])
      } else {
        setPasswordErrors([])
      }
    }


    
    if(loading) return <Loading />

  

  return (
    <>
    {
      showSignIn ? (
        <>
        <ToastContainer />
        <div className='flex flex-col gap-3 justify-center items-center w-screen h-screen bg-gray-800'>
            <Logo />
            <div className='flex flex-col gap-10'>
              <input 
              placeholder='Enter your email' 
              value={email} type="text" 
              onChange={e => {
                setEmail(e.target.value)
                validateEmail(e.target.value)
                }} 
                className={`border rounded bg-transparent placeholder:text-center placeholder:text-white placeholder:text-sm  border-blue-200 p-2 focus:outline-none focus:placeholder:text-transparent focus:text-center caret-white focus:text-white text-center text-white 
                ${emailErrors.length > 0 ? 'border-red-400 focus:border-red-400' : 'border-blue-200 focus:border-yellow-300'}
                `} 
                required />

            {emailErrors && emailErrors.length > 0 && emailErrors.map((error, index) => (
              <p className='text-red-400 text-sm text-center' key={index}>{error}</p>
            ))}


              <input 
              placeholder='Enter your password' 
              type="password"  
              value={password} 
              onChange={e => {
                setPassword(e.target.value)
                validatePassword(e.target.value)
              }} 
              className={`border rounded bg-transparent placeholder:text-center placeholder:text-white placeholder:text-sm  border-blue-200 p-2 focus:outline-none focus:placeholder:text-transparent focus:text-center caret-white focus:text-white text-center text-white 
              ${passwordErrors.length > 0 ? 'border-red-400 focus:border-red-400' : 'border-blue-200 focus:border-yellow-300'}
              `} 
              required />
            </div>

            {passwordErrors && passwordErrors.length > 0 && passwordErrors.map((error, index) => (
              <p className='text-red-400 text-sm text-center' key={index}>{error}</p>
            ))}

            <button className='bg-yellow-300 text-gray-800 hover:border hover:border-yellow-300 font-bold py-2 px-6 mt-5 rounded hover:text-yellow-300 hover:bg-gray-800 ' onClick={handleSignIn}>Sign In</button> 

            <hr className='border-1 border-blue-200 w-1/2' />
            <p className='text-white text-sm'>Or sign in with</p>
            <button className='border-yellow-300 border  font-bold py-2 px-6 mt-5 rounded hover:bg-yellow-300  hover:border-yellow-300' onClick={signInWithGoogle}><FcGoogle/></button>

            <p className='text-white text-sm mt-3'>Don't have an account? <span className='text-yellow-300 cursor-pointer' onClick={() => setShowSignIn(false)}>Sign Up</span></p>

         </div>
         </>
      ) : (
        
        <SignUp setShowSignIn={setShowSignIn}/>
      )
    }
    </>
  


   
  )
}


