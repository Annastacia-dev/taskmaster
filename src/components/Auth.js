import { useState } from 'react'
import { getAuth } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import Logo from './Logo';



export const Auth = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

  return (
    <div className='flex flex-col gap-3 justify-center items-center w-screen h-screen bg-gradient-to-r from-blue-900 to-blue-500 '>
        <Logo />
        <input placeholder='Enter your email' value={email} type="text" onChange={e => setEmail(e.target.value)} className='border-b-2 bg-transparent placeholder:text-center placeholder:text-white placeholder:text-sm  border-blue-200 p-2 focus:outline-none focus:border-yellow-300 focus:placeholder:text-transparent focus:text-center caret-white focus:text-white' />
        <input placeholder='Enter your password' type="password"  value={password} onChange={e => setPassword(e.target.value)} className='border-b-2 bg-transparent placeholder:text-center placeholder:text-white placeholder:text-sm  border-blue-200 p-2 focus:outline-none focus:border-yellow-300 focus:placeholder:text-transparent focus:text-center caret-white focus:text-white' />

        <button className='bg-yellow-300 text-blue-900 font-bold py-2 px-6 mt-5 rounded hover:text-yellow-300 hover:bg-blue-900'>Sign In</button>
      
    </div>
  )
}


