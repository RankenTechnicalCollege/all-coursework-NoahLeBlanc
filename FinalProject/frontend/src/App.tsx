import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

// Page imports
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BugList from "./components/pages/bugList";
import { UserList } from "./components/pages/userList";
import BugEditor from "./components/pages/bugEdit";
import UserEditor from "./components/pages/userEdit";
import LoginForm from "./components/pages/LoginForm";
import RegisterForm from "./components/pages/RegisterForm";
import ReportBug from "./components/pages/ReportBug";

const queryClient = new QueryClient();

// Toast notification functions
function showError(message: string) {
  toast(message, { type: 'error', position: 'bottom-right' });
}

function showSuccess(message: string) {
  toast(message, { type: 'success', position: 'bottom-right' });
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="App">
          <ToastContainer aria-label="toast" />
          <main className="container my-5">
            <Routes>
              {/* Default route - redirects to login */}
              <Route path="/" element={<Navigate to="/login" />} />
              
              {/* Authentication routes */}
              <Route path="/login" element={<LoginForm showError={showError} showSuccess={showSuccess} />} />
              <Route path="/register" element={<RegisterForm showError={showError} showSuccess={showSuccess} />} />
              
              {/* Bug routes */}
              <Route path="/bug/list" element={<BugList showError={showError} showSuccess={showSuccess} />} />
              <Route path="/bug/report" element={<ReportBug showError={showError} showSuccess={showSuccess} />} />
              <Route path="/bug/:bugId" element={<BugEditor showError={showError} showSuccess={showSuccess} />} />
              
              {/* User routes */}
              <Route path="/user/list" element={<UserList showError={showError} showSuccess={showSuccess} />} />
              <Route path="/user/:userId" element={<UserEditor showError={showError} showSuccess={showSuccess} />} />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export { showError, showSuccess };
export default App;