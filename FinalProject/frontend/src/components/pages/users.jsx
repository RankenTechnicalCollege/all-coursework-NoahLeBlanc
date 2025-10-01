import { useState, useEffect } from 'react'
import axios from 'axios'

//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('http://localhost:8080/api/user/list')
      setUsers(response.data)
    }
    fetchUsers()
  }, [])

  //Capitalizes the first letter of the word. 
  const capitalize = str => str ? str.charAt(0).toUpperCase() + str.slice(1) : ""

  return (
    <div className='position-absolute top-0 start-0 bg-dark text-light w-100 h-100'>
    <div className="d-flex flex-wrap gap-3 justify-content-center">
      {users.map(user => (
        <div className="border rounded p-3" key={user._id}>
          <h3>
            {capitalize(user.givenName)} {capitalize(user.familyName)}
          </h3>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      ))}
    </div>
    </div>
  )
}

export default Users
