import { useEffect , useState, useContext } from 'react'
import { UserContext } from '../contexts/user';
import { auth, db } from '../config/firebase';
import { collection, getDocs, setDoc, getDoc, doc } from 'firebase/firestore';
import Loading from './Loading';
import { AiOutlineCheckCircle, AiTwotoneEdit, AiOutlineLoading3Quarters, AiTwotoneDelete, AiFillCaretDown, AiFillCaretUp }  from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import EditTaskModal from './EditTaskModal';
import DeleteTaskModal from './DeleteTaskModal';
import formatDate  from './utils/formatDate';



const TasksTable = () => {

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

    const [showSortList, setShowSortList] = useState(false)

    const [filteredTasks, setFilteredTasks] = useState([])

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
          setLoading(true)
          await setDoc(taskRef, updatedTask)
          setLoading(false)
          taskData.completed ? toast.success('Task marked as incomplete', toastStyles) : toast.success('Task marked as complete', toastStyles)
          window.location.reload()
        } catch (error) {
          console.log(error)
        }
      }
    
    useEffect(() => {
      const userTasks = tasks.filter(task => task.userId === auth.currentUser.uid)
      setFilteredTasks(userTasks)
    },[tasks])

    // priority filter
    const handleFilterByPriority = (e) => {
      const priority = e.target.value
      if (priority === 'All') {
        const userTasks = tasks.filter(task => task.userId === auth.currentUser.uid)
        setFilteredTasks(userTasks)
      } else {
        const filteredTasks = tasks.filter(task => task.userId === auth.currentUser.uid && task.priority === priority)
        setFilteredTasks(filteredTasks)
      }
     
    }

    // label filter
    const handleFilterByLabel = (e) => {
      const label = e.target.value
      if (label === 'All') {
        const userTasks = tasks.filter(task => task.userId === auth.currentUser.uid)
        setFilteredTasks(userTasks)
      } else {
        const filteredTasks = tasks.filter(task => task.userId === auth.currentUser.uid && labels.filter(label => label.id === task.labelId)[0].name === label)
        setFilteredTasks(filteredTasks)
      }
    }

    // status filter
    const handleFilterByStatus = (e) => {
      const status = e.target.value
      if (status === 'All') {
        const userTasks = tasks.filter(task => task.userId === auth.currentUser.uid)
        setFilteredTasks(userTasks)
      } else if (status === 'Complete') {
        const filteredTasks = tasks.filter(task => task.userId === auth.currentUser.uid && task.completed === true)
        setFilteredTasks(filteredTasks)
      } else {
        const filteredTasks = tasks.filter(task => task.userId === auth.currentUser.uid && task.completed === false)
        setFilteredTasks(filteredTasks)
      }
    }
    
    // sort by due date
    const handleSortByDueDate = (e) => {
      const sortBy = e.target.value
      if (sortBy === 'Ascending') {
        const sortedTasks = tasks.filter(task => task.userId === auth.currentUser.uid).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        setFilteredTasks(sortedTasks)
      } else {
        const sortedTasks = tasks.filter(task => task.userId === auth.currentUser.uid).sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
        setFilteredTasks(sortedTasks)
      }
    }




    if (loading) return <Loading />

   

  return (
    <>
    < ToastContainer />
    <div className="flex justify-center">
      <div className="w-11/12 h-screen mb-20">
        <div className='flex justify-end'>
            <button className='bg-transparent border-white border uppercase text-xs leading-wider text-white px-2 py-1 flex gap-1 'onClick={() => {setShowSortList(!showSortList)}}>
              <span>sort by</span>
              <span className='mt-0.5'>{ showSortList ?  <AiFillCaretUp /> : <AiFillCaretDown />}</span>
            </button>

            {
              showSortList && (
               <>
               <div className="relative inline-block text-left">
                    <div className="absolute -right-5 top-10 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                      <div className="py-1 flex flex-col justify-center items-center" role="none">
                        <select className="text-gray-700 bg-transparent block px-4 py-2 text-xs w-8/12" role="menuitem" tabIndex="-1" id="menu-item-0"
                        onChange={handleFilterByPriority}
                        >
                          <option disabled selected>Priority</option>
                          <option value="All">All</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                        <select className="text-gray-700 bg-transparent block px-4 py-2 text-xs w-8/12" role="menuitem" tabIndex="-1" id="menu-item-1"
                        onChange={handleFilterByStatus}
                        >
                          <option disabled selected>Status</option>
                          <option value="All">All</option>
                          <option value="Complete">Complete</option>
                          <option value="Incomplete">Incomplete</option>
                        </select>

                        <select className="text-gray-700 bg-transparent block px-4 py-2 text-xs w-8/12" role="menuitem" tabIndex="-1" id="menu-item-1"
                        onChange={handleSortByDueDate}
                        >
                          <option disabled selected>Due Date</option>
                          <option value="Ascending">Ascending</option>
                          <option value="Descending">Descending</option>
                        </select>

                        <select className="text-gray-700 bg-transparent block px-4 py-2 text-xs w-8/12" role="menuitem" tabIndex="-1" id="menu-item-2"
                        onChange={handleFilterByLabel}
                        >
                          <option disabled selected>Category</option>
                          <option value="All">All</option>
                          <option value="Personal">Personal</option>
                          <option value="Family">Family</option>
                          <option value="Friends">Friends</option>
                          <option value="Finance">Finance</option>
                          <option value="Education">Education</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Travel">Travel</option>
                          <option value="Health">Health</option>
                          <option value="Shopping">Shopping</option>
                          <option value="Work">Work</option>
                          <option value="Home">Home</option>
                        </select>
                      </div>

                    </div>
                  </div>
               </>
              )
            }


        </div>
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
                        Due Date
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
                            <tr key={task.id}  className={`
                          ${task.completed && new Date(task.dueDate) < new Date() ? 'bg-green-900' : task.completed && new Date(task.dueDate) > new Date() ? 'bg-green-900' : !task.completed && new Date(task.dueDate) < new Date() ? 'bg-red-900' : 'bg-gray-900'}
                            text-white cursor-pointer hover:bg-yellow-300 hover:text-black ${task.completed && 'line-through'}
                            `} title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}>

                                <td className="px-6 py-4 whitespace-nowrap text-sm"   onClick={() => handleCompletedTask(task.id)} title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}>
                                {task.completed ? ( <AiOutlineCheckCircle className='w-5 h-5' />) : (<AiOutlineLoading3Quarters />)}
                                </td>
                                <td className="relative px-6 py-4 whitespace-nowrap text-xs">
                                            {task.title}
                                            {
                                !task.completed && new Date(task.dueDate) < new Date() ? (
                                  <div className="absolute -top-1 -right-2">
                                    <span className="inline-flex items-center justify-center h-3 w-3 rounded-full text-xs bg-red-500 animate-ping">
                                    </span>
                                  </div>
                                ) : null
                              }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs">
                                            {task.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs">
                                    {priorities.map(priority => priority.name === task.priority && <span key={priority.name} className={`inline-block px-2 py-1 text-xs font-semibold leading-tight text-${priority.color} bg-gray-800 rounded-full`}>{priority.name}</span>)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs">
                                          {formatDate(task.dueDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs">
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
                                    <button className="text-red-300 hover:text-red-600" onClick = {() => {
                                        setShowDeleteModal(!showDeleteModal)
                                        setSelectedTask(task)
                                        }}>
                                        <AiTwotoneDelete title='Delete Task' />
                                    </button>
                                </td>     
                            </tr>
                            
                            )}) : ( 
                            <>
                            <tr className="bg-gray-800 text-white text-center">
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

export default TasksTable;
