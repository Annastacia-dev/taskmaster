import { useState } from 'react'
import { auth, googleProvider } from '../../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import Logo from '../Logo';
import Loading from '../Loading';
import { FcGoogle } from 'react-icons/fc'



export const SignUp = ({ setShowSignIn, setUser }) => {

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [emailError, setEmailError] = useState('')

    const handleSignUp = async () => {
        setLoading(true)
        try{
          await createUserWithEmailAndPassword(auth, email, password)
          setUser(auth.currentUser)
        setLoading(false)
        } catch (error) {
          setLoading(false)
          console.error(error)
        }
    }

    const signUpWithGoogle = async () => {
      try{
        setLoading(true)
        await signInWithPopup(auth, googleProvider)
        setUser(auth.currentUser)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }





    if (loading) {
        return <Loading />
    }

    const validatePassword = (e) => {
      if (e.target.value.length < 6) {
        setPasswordError('Password must be at least 6 characters')
      } else {
        setPasswordError('');
      }
    }

    const validateEmail = (e) => {
      const re = /\S+@\S+\.\S+/;
      if (!re.test(e.target.value)) {
        setEmailError('Email address is invalid')
      } else {
        setEmailError('');
      }
    }



  return (
    <div className='flex flex-col gap-3 justify-center items-center w-screen h-screen bg-gradient-to-r from-blue-900 to-blue-500 '>
        <Logo />
        <input 
        placeholder='Enter your email' 
        value={email} 
        type="text" 
        onChange={e => {
          setEmail(e.target.value)
          validateEmail(e)
        }} 
        className={`border-b-2 bg-transparent placeholder:text-center placeholder:text-white placeholder:text-sm  border-blue-200 p-2 focus:outline-none focus:placeholder:text-transparent focus:text-center caret-white focus:text-white text-center text-white 
        ${emailError ? 'border-red-400 focus:border-red-400' : 'border-blue-200 focus:border-yellow-300'}
        `} required />

        {emailError && <p className='text-yellow-300 text-sm'>{emailError}</p>}

        <input 
        placeholder='Enter your password' 
        type="password"  
        value={password} 
        onChange={e => {
          setPassword(e.target.value)
          validatePassword(e)
        }}
        className={`border-b-2 bg-transparent placeholder:text-center placeholder:text-white placeholder:text-sm  border-blue-200 p-2 focus:outline-none focus:placeholder:text-transparent focus:text-center caret-white focus:text-white text-center text-white 
        ${passwordError ? 'border-red-400 focus:border-red-400' : 'border-blue-200 focus:border-yellow-300'}
        `} />

        {passwordError && <p className='text-yellow-300 text-sm'>{passwordError}</p>}
        
        <button className='bg-yellow-300 text-blue-900 font-bold py-2 px-6 mt-5 rounded hover:text-yellow-300 hover:bg-blue-900' onClick={handleSignUp}>Sign Up</button>

        <hr className='border-1 border-blue-200 w-1/2' />

        <p className='text-white text-sm'>Or sign up with</p>

        <button className='bg-blue-900 text-white font-bold py-2 px-6 mt-5 rounded hover:text-blue-900 hover:bg-yellow-300' onClick={signUpWithGoogle}><FcGoogle /></button>

        
        <p className='text-white text-sm mt-3'>Already have an account? <span className='text-yellow-300 cursor-pointer' onClick={() => setShowSignIn(true)}>Sign In</span></p>
      
    </div>
  )
}

