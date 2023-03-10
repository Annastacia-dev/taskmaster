import { auth } from '../config/firebase'
import { signOut } from "firebase/auth";
import Logo from './Logo';
import Loading from './Loading';
import { useState } from 'react'
import { BsFillPersonFill } from 'react-icons/bs'
import { GrFormClose } from 'react-icons/gr'
import { useContext } from 'react'
import { UserContext } from '../contexts/user'

const NavBar = () => {

    const { setUser } = useContext(UserContext)


    const [loading, setLoading] = useState(false)
    const [toggleModal, setToggleModal] = useState(false)
    const [dropdown, setDropdown] = useState(false)

    
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

    const handleToggleModal = () => {
        setToggleModal(!toggleModal)
    }

    const handleToggleDropdown = () => {
        setDropdown(!dropdown)
    }



    if (loading) {
        return <Loading />
    }


    const { displayName, photoURL } = auth?.currentUser || {
        displayName: 'Guest',
        photoURL: 'https://png.pngtree.com/png-clipart/20220904/ourmid/pngtree-human-profile-avatar-ui-button-3d-icon-render-png-image_6137257.png'
    }


    const firstName = displayName?.split(' ')[0]

  return (
    <>
 <nav className="bg-gray-900">
  <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    <div className="relative flex items-center justify-between h-16">
      <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
        <div className="flex-shrink-0 flex items-center justify-center mt-5">
          <Logo className='mt-2' />
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <div className="ml-3 relative">
          <div>
            <button className='border rounded flex items-center justify-center px-4 py-2 gap-2 text-white hover:text-gray-800 hover:bg-white'
              onClick={handleToggleDropdown}
            >
              <img src={photoURL ? photoURL : "https://png.pngtree.com/png-clipart/20220904/ourmid/pngtree-human-profile-avatar-ui-button-3d-icon-render-png-image_6137257.png"} alt="user" className='w-8 h-8 rounded-full' />
              <p className="text-sm">{firstName?.toLocaleUpperCase()}</p>
              {dropdown && (
                <>
                  <div className="relative inline-block text-left">
                    <div className="absolute -right-5 top-10 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                      <div className="py-1" role="none">
                        <a href="/profile" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">Your Profile</a>
                      </div>
                      <div className="py-1" role="none">
                        <button onClick={handleToggleModal} className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-3">Sign out</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
    {
        toggleModal && (
            <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-300 bg-opacity-20 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded  text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className='relative flex justify-end'>
                            <button onClick={() => {
                                setToggleModal(false)
                                setDropdown(true)
                            }} className='absolute right-0 top-0'>
                                <GrFormClose className='h-6 w-6' />
                            </button>
                        </div>
                        <div className="sm:flex gap-2 sm:items-center sm:justify-center">
                            <BsFillPersonFill className="h-5 w-15" />
                            <p className="text-center text-sm text-gray-900">
                                {displayName}
                            </p>
                        </div>
                        <div className="sm:flex sm:items-center sm:justify-center">
                            <div className="mt-3 text-center sm:mt-6 sm:ml-4 sm:text-center">
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to sign out?
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse items-center justify-center mt-5">
                        <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleSignOut}>
                            Sign Out
                        </button>
                        <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleToggleModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
 

  )
    }
    </>

  )
}

export default NavBar