import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import UserList from "./components/pages/userList"
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  	<BrowserRouter>
		<UserList/>
  	</BrowserRouter>
  </StrictMode>,
);
