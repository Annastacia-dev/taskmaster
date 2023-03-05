import { auth } from '../config/firebase'
import { signOut } from "firebase/auth";
import Logo from './Logo';
import Loading from './Loading';
import { useState } from 'react'
import { BsFillPersonFill } from 'react-icons/bs'

const NavBar = ({ setUser }) => {

    const [loading, setLoading] = useState(false)
    const [toggleModal, setToggleModal] = useState(false)

    
    const handleSignOut = async () => {
        try{
            setLoading(true)
            await signOut(auth)
            setUser(auth.currentUser)
            setLoading(false)
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) {
        return <Loading />
    }

    console.log(auth)

    const username = auth.currentUser.displayName

    const firstName = username.split(' ')[0]

    console.log(firstName)




  return (
    <nav className="bg-gray-800">
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                    <Logo />
                </div>
                <div className="hidden sm:block sm:ml-6">
                    <div className="flex space-x-4">
                        <a href="/" className="text-white px-3 py-2 rounded-md text-sm font-medium" aria-current="page">Dashboard</a>
                    </div>
                </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="ml-3 relative">
                    <div>
                        <button className='border rounded flex items-center justify-center px-4 py-2 gap-2 text-white hover:text-gray-800 hover:bg-white'>
                            <BsFillPersonFill className="h-6 w-6" />
                            <p className="text-sm">{firstName.toLocaleUpperCase()}</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="sm:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="/" className="text-white block px-3 py-2 rounded-md text-base font-medium" aria-current="page">Dashboard</a>
        </div>
    </div>
    </nav>

  )
}

export default NavBar