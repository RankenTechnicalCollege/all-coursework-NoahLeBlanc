
import { useState, useEffect } from 'react'
import 'bootstrap' 
import 'bootstrap-icons' 
import axios from 'axios'


function Users() {
  //creates a var to store our users, creates a function to set our initial value is an empty array
  const [users, setUsers] = useState([])


  //use effect is a function that loads when the page is loaded
  useEffect(() => {
    const fetchUsers = async () => {
      //async function to fetch users from the backend
      const response = await axios.get('http://localhost:8080/api/user/list')
      setUsers(response.data)
    }
    fetchUsers()
  }, [])//empty array means it only runs once when the page loads

  return (
    <>
        {/* map through the users and display them in a list */}
        {users.map(user => (
          <div className='' key={user._id}>
            <h3>{user.familyName} {user.givenName}</h3>
            <p>{user.email}</p>
            <p>{user.role}</p>
          </div>
        ))}
    </>
  )
}
export default Users