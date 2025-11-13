// AppLayout.jsx
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      <header>
        <nav>
          <h2>My App Navbar</h2>
        </nav>
      </header>

      <main className="">
        <Outlet />
      </main>

      <footer className="">
        <small>© 2025 My App</small>
      </footer>
    </div>
  );
}
