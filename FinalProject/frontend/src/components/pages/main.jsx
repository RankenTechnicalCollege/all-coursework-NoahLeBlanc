import Users from './users.jsx'
import Footer from '../footer.jsx'

//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css';

function Main() {
  return (
    <div className='bg-dark text-light'>
        <Users/>
        <Footer/>
    </div>
  )
}
export default Main 