import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layout/app-layout';
import { LoginForm } from './components/login-form';
import { FaviconManager } from './components/FaviconManager';

function App() {
  return (
    <>
      <FaviconManager /> {/* sets the favicon */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<div className="p-4">Home page content</div>} />
          </Route>
          <Route path="/login" element={<LoginForm className="mx-80 my-32" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
