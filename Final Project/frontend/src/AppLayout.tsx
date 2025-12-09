import { Outlet } from "react-router-dom";
  3  
  4 export default function AppLayout() {
  5   return (
  6     <div>
  7       <header>
  8         <nav>
  9           <h2>My App Navbar</h2>
 10         </nav>
 11       </header>
 12  
 13       <main className="">
 14         <Outlet />
 15       </main>
 16  
 17       <footer className="">
 18         <small>© 2025 My App</small>
 19       </footer>
 20     </div>
 21   );
 22 }

