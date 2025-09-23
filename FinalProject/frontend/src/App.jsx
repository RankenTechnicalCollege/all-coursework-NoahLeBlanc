
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'

//Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';


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
      <Navbar />
      <Footer />
    </>
  );
}

export default App;

