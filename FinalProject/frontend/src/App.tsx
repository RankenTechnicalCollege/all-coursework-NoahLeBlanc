import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "./components/Layout";

// Pages
import Index from "./components/pages/Index";
import NotFound from "./components/pages/NotFound";
import LoginForm from "./components/pages/LoginForm";
import RegisterForm from "./components/pages/RegisterForm";

// Users
import UserEdit from "./components/pages/UserEdit";
import UserList from "./components/pages/UserList";

// Bugs
import BugEdit from "./components/pages/BugEdit";
import BugList from "./components/pages/BugList";

const App = () => (
  <Routes>
    {/* ---------- Public (no layout) ---------- */}
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/register" element={<RegisterForm />} />

    {/* ---------- Layout wrapped routes ---------- */}
    <Route element={<Layout />}>
      {/* Users */}
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:id" element={<UserEdit />} />
      <Route path="/me" element={<UserEdit />} />

      {/* Bugs */}
      <Route path="/bugs" element={<BugList />} />
      <Route path="/bugs/:id" element={<BugEdit />} />
    </Route>

    {/* ---------- Fallback ---------- */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
