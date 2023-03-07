import { useState, useContext } from 'react'
import { auth, googleProvider, db } from '../../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import Logo from '../Logo';
import Loading from '../Loading';
import { FcGoogle } from 'react-icons/fc'
import { UserContext } from '../../contexts/user'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export const SignUp = ({ setShowSignIn }) => {
    
    const { setUser } = useContext(UserContext)

    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [nameError, setNameError] = useState('')

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

   

    const handleSignUp = async () => {
        setLoading(true)
        try{
          await createUserWithEmailAndPassword(auth, email, password)
          await updateProfile(auth.currentUser, { displayName: name })
          await db.collection('users').doc(auth.currentUser.uid).set({
            name: name,
            email: email,
            id: auth.currentUser.uid,
            password: password
          })
          setUser(auth.currentUser)  
          setLoading(false)
        } catch (error) {
          setLoading(false)
          console.error(error)
          if (error.code === 'auth/email-already-in-use'){
            toast.error('Email already in use', toastStyle)
          } else if (error.code === 'auth/invalid-email') {
            toast.error('Invalid email', toastStyle)
          } else if (error.code === 'auth/weak-password') {
            toast.error('Password must be at least 6 characters', toastStyle)
          } else {
            toast.error('SignUp failed', toastStyle)
          }
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

    // Validate name, not empty more than 2 characters
    const validateName = (e) => {
      if (e.target.value.length < 2) {
        setNameError('Name must be at least 2 characters')
      } else {
        setNameError('');
      }
    }

  return (
    <>
    <ToastContainer />
    <div className='flex flex-col gap-3 justify-center items-center w-screen h-screen bg-gray-800'>
        <Logo />
        <input 
        placeholder='Enter your name' 
        value={name} 
        type="text" 
        onChange={e => {
          setName(e.target.value)
          validateName(e)
        }} 
        className={`border mb-5 rounded bg-transparent placeholder:text-center placeholder:text-white placeholder:text-sm  border-blue-200 p-2 focus:outline-none focus:placeholder:text-transparent focus:text-center caret-white focus:text-white text-center text-white 
         focus:border-yellow-300 ${nameError ? 'border-red-400 focus:border-red-400' : 'border-blue-200 focus:border-yellow-300'}
         `} required />

         {nameError && <p className='text-red-500 text-sm text-center'>{nameError}</p>}

        <input 
        placeholder='Enter your email' 
        value={email} 
        type="text" 
        onChange={e => {
          setEmail(e.target.value)
          validateEmail(e)
        }} 
        className={`border mt-5 mb-5 rounded bg-transparent placeholder:text-center placeholder:text-white placeholder:text-sm  border-blue-200 p-2 focus:outline-none focus:placeholder:text-transparent focus:text-center caret-white focus:text-white text-center text-white 
        ${emailError ? 'border-red-400 focus:border-red-400' : 'border-blue-200 focus:border-yellow-300'}
        `} required />

        {emailError && <p className='text-red-500 text-sm text-center'>{emailError}</p>}

        <input 
        placeholder='Enter your password' 
        type="password"  
        value={password} 
        onChange={e => {
          setPassword(e.target.value)
          validatePassword(e)
        }}
        className={`border rounded mt-5 bg-transparent placeholder:text-center placeholder:text-white placeholder:text-sm  border-blue-200 p-2 focus:outline-none focus:placeholder:text-transparent focus:text-center caret-white focus:text-white text-center text-white 
        ${passwordError ? 'border-red-400 focus:border-red-400' : 'border-blue-200 focus:border-yellow-300'}
        `} />

        {passwordError && <p className='text-red-500 text-sm text-center'>{passwordError}</p>}
        
        <button className='bg-yellow-300 text-gray-800 font-bold py-2 px-6 mt-5 rounded hover:border-yellow-300 hover:border hover:bg-transparent hover:text-yellow-300' onClick={handleSignUp}>Sign Up</button>

        <hr className='border-1 border-blue-200 w-1/2' />

        <p className='text-white text-sm'>Or sign up with</p>

        <button className='py-2 px-6 mt-5 rounded hover:border-yellow-300 hover:border hover:bg-transparent bg-yellow-300' onClick={signUpWithGoogle}><FcGoogle /></button>

        
        <p className='text-white text-sm mt-3'>Already have an account? <span className='text-yellow-300 cursor-pointer' onClick={() => setShowSignIn(true)}>Sign In</span></p>
      
    </div>

    </>
  )
}


