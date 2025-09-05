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

    <main className='container d-flex justify-content-evenly'> 
      <div className='d-flex justify-content-center border border-primary'>
        <div className='vstack'>
        <h1 className=''>Users</h1>  
        <ul className=''>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        </div>
      </div>

      <div className='d-flex justify-content-center border border-danger'>
        <div className='vstack'>
        <h1 className=''>Bugs</h1>  
        <ul className=''>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        </div>
      </div>
    </main>

    <footer className="footer  bg-dark text-light">
      <div className="container">
        <h4 className="d-flex justify-content-center">@2025 Niah LeBlanc</h4>
      </div>
    </footer>
    </>
  )
}

export default App
