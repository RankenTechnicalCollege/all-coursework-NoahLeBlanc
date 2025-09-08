import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'


import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch users
    fetch("https://issuetracker-service-1029534851049.us-central1.run.app/api/user/list")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));

    // Fetch bugs
    fetch("http://localhost:2026/api/bug/list")
      .then((res) => res.json())
      .then((data) => setBugs(data))
      .catch((err) => console.error("Error fetching bugs:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

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

      <main className="container d-flex justify-content-evenly mt-4">
        {/* Users section */}
        <div className="d-flex justify-content-center border border-dark border-5  rounded-bottom px-5">
          <div className="vstack">
            <h1>Users</h1>
            <ul>
              {users.map((user) => (
                <li key={user.userId}>
                  {user.givenName} {user.familyName} — {user.role}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bugs section */}
        <div className="d-flex justify-content-center border border-dark border-5 rounded-bottom px-5">
          <div className="vstack">
            <h1>Bugs</h1>
            <ul>
              {bugs.map((bug) => (
                <li key={bug.id}>
                  {bug.title} — {bug.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <footer className="footer bg-dark text-light mt-5">
        <div className="container">
          <h4 className="d-flex justify-content-center">@2025 Niah LeBlanc</h4>
        </div>
      </footer>
    </>
  );
}

export default App;

