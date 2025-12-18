import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from './components/AppLayout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import BugList from './components/BugList';
import BugEditor from './components/BugEditor';
import UserList from './components/UserList';
import UserEditor  from './components/UserEditor';
import type { UserData } from './components/UserEditor';
import NotFound from './components/NotFound';

function App() {
  // Example handler for editing a user
  const handleEditUser = (id: string) => {
    console.log("Edit user with ID:", id);
  };

  // Example handler for saving user data
  const handleSaveUser = (data: UserData) => {
    console.log("Save user data:", data);
  };

  const handleCancel = () => {
    console.log("Cancelled");
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route element={<AppLayout />}>
          <Route path="/bug/list" element={<BugList />} />
          <Route path="/bug/:bugId" element={<BugEditor />} />
          <Route
            path="/user/list"
            element={<UserList onEditUser={handleEditUser} />}
          />
          <Route
            path="/user/:userId"
            element={
              <UserEditor
                userId="someId"
                onSave={handleSaveUser}
                onCancel={handleCancel}
              />
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
