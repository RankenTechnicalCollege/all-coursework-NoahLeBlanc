import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'


function App() {
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <a className="navbar-brand d-flex align-items-center gap-2" href="#">
        <i className="bi bi-code-slash"></i>
        <span className="h4 mb-0">Bug Tracker</span>
      </a>
      <ul className="navbar-nav ms-3">
        <li className="nav-item">
          <a className="nav-link text-light" href="#">Users</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-light" href="#">Bugs</a>
        </li>
      </ul>
    </nav>  

    <main className='d-flex justify-content-evenly'> 
      <div className='d-flex justfiy-content-center'>
        <h1>Users</h1>  
      </div>

      <div className='d-flex justfiy-content-center'>
        <h1>Bugs</h1>  
      </div>
    </main>

    <footer className="footer bg-dark text-light">
      <div className="container">
        <span className="">@2025 Niah LeBlanc</span>
      </div>
    </footer>
    </>
  )
}

export default App
