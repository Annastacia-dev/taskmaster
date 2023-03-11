import { useEffect , useState, useContext } from 'react'
import { UserContext } from '../contexts/user';
import { auth, db } from '../config/firebase';
import { collection, getDocs, setDoc, deleteDoc, getDoc, doc } from 'firebase/firestore';
import Loading from './Loading';
import { BsFillPencilFill } from 'react-icons/bs'
import { AiOutlineCheckCircle, AiOutlineDelete, AiOutlineLoading3Quarters }  from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';


const Table = () => {

  const toastStyles = {
    position: 'top-center',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored'
  }

    
    const { labels, priorities } = useContext(UserContext)


    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      const fetchTasks = async () => {
        try {
          setLoading(true)
          const tasksRef = collection(db, 'tasks')
          const tasksSnapshot = await getDocs(tasksRef)
          const tasksList = tasksSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
          setTasks(tasksList)
          setLoading(false)
        } catch (error) {
          console.log(error)
        }
      }
      fetchTasks()
    }, [])

    const handleCompletedTask = async (id) => {
        const taskRef = doc(db, 'tasks', id)
        const taskSnapshot = await getDoc(taskRef)
        const taskData = taskSnapshot.data()
    
        const updatedTask = {
          ...taskData,
          completed: !taskData.completed
        }
    
        try {
          await setDoc(taskRef, updatedTask)
          taskData.completed ? toast.success('Task marked as incomplete', toastStyles) : toast.success('Task marked as complete', toastStyles)
          window.location.reload()
        } catch (error) {
          console.log(error)
        }
      }
    
      // delete task
    
      const handleDeleteTask = async (id) => {
        const taskRef = doc(db, 'tasks', id)
        try {
          await deleteDoc(taskRef)
          toast.error('Task deleted successfully', toastStyles)
          window.location.reload()
        } catch (error) {
          console.log(error)
        }
      }
  
    const filteredTasks = tasks.filter(task => task.userId === auth.currentUser.uid)

    if (loading) return <Loading />

  return (
    <>
    <div className="flex justify-center">
      <div className="w-full">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Label
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {
                        filteredTasks.map(task => (
                            <tr key={task.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {
                                                task.completed ? ( <AiOutlineCheckCircle />
                                                ) : (
                                                    <AiOutlineLoading3Quarters />
                                                )
                                            }
                                </td>
                            </tr>
                        ))
                    }
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Table;
