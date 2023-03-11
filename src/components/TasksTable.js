import { useEffect , useState, useContext } from 'react'
import { UserContext } from '../contexts/user';
import { auth, db } from '../config/firebase';
import { collection, getDocs, setDoc, getDoc, doc } from 'firebase/firestore';
import Loading from './Loading';
import { AiOutlineCheckCircle, AiTwotoneEdit, AiOutlineLoading3Quarters, AiTwotoneDelete }  from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import EditTaskModal from './EditTaskModal';
import DeleteTaskModal from './DeleteTaskModal';


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

    const [selectedTask, setSelectedTask] = useState(null)

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

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
    
    const filteredTasks = tasks.filter(task => task.userId === auth.currentUser.uid)

    if (loading) return <Loading />

  return (
    <>
    < ToastContainer />
    <div className="flex justify-center">
      <div className="w-11/12 mb-20">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden">
              <table className="min-w-full border-separate border-spacing-x-0 border-spacing-y-6">
                <thead className="bg-gray-600">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-yellow-300 uppercase tracking-wider">
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
                <tbody >
                {
                        filteredTasks.length > 0 ? filteredTasks.map(task => {
                            return (
                            <tr key={task.id}  className={`${task.completed ? 'bg-gray-900' : 'bg-gray-700'} text-white cursor-pointer hover:bg-yellow-300 hover:text-black ${task.completed && 'line-through'}`} title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"   onClick={() => handleCompletedTask(task.id)} title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}>
                                
                                            {task.completed ? ( <AiOutlineCheckCircle />) : (<AiOutlineLoading3Quarters />)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {task.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {task.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {priorities.map(priority => priority.name === task.priority && <span key={priority.name} className={`inline-block px-2 py-1 text-xs font-semibold leading-tight text-${priority.color} bg-gray-800 rounded-full`}>{priority.name}</span>)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {labels.map(label => label.id === task.labelId && 
                                    <span key={label.id} className={`inline-block px-2 py-1 text-xs font-semibold leading-tight`}>
                                    <i className={`${label.icon} mr-2`}></i>
                                    {label.name}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-300 hover:text-blue-600" 
                                    onClick = {() => {
                                        setShowEditModal(!showEditModal)
                                        setSelectedTask(task)
                                    }}
                                    >
                                        < AiTwotoneEdit title='Edit Task' />
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-red-600 hover:text-red-900" onClick = {() => {
                                        setShowDeleteModal(!showDeleteModal)
                                        setSelectedTask(task)
                                        }}>
                                        <AiTwotoneDelete title='Delete Task' />
                                    </button>
                                </td>     
                            </tr>
                            
                            )}) : ( 
                            <>
                            <tr className="bg-gray-300">
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    No tasks yet
                                </td>
                            </tr>
                            </>
                            
                        )
                    }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
        
        {showEditModal && <EditTaskModal showEditModal={showEditModal} setShowEditModal={setShowEditModal} task={selectedTask} />}
        {showDeleteModal && <DeleteTaskModal showDeleteModal={showDeleteModal} setShowDeleteModal=
        {setShowDeleteModal} task={selectedTask} />}
    </div>
    </>
  );
};

export default Table;
