//|====================================================================================================|
//|----------------------------------------------[-Imports-]-------------------------------------------|
//|====================================================================================================|
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";

//|====================================================|
//|---------------------[-Users-]----------------------|
//|====================================================|
import UserEdit from "./components/pages/UserEdit";
import UserList from "./components/pages/UserList";

//|====================================================|
//|---------------------[-Bugs-]----------------------|
//|====================================================|
import BugEdit from "./components/pages/BugEdit";
import BugListSummary from "./components/pages/BugListSummary";

//|====================================================|
//|------------------[-Auth & Misc-]------------------|
//|====================================================|
import Index from "./components/pages/Index";
import NotFound from "./components/pages/NotFound";
import LoginForm from "./components/pages/LoginForm";
import RegisterForm from "./components/pages/RegisterForm";

//|====================================================================================================|
//|-----------------------------------------------[-App-]---------------------------------------------|
//|====================================================================================================|
const App = () => (
  // <QueryClientProvider client={queryClient}>
  <TooltipProvider>
    <Sonner />

    {/* BrowserRouter is already in main.jsx */}
    <Routes>
      {/*---------------- Auth Routes ----------------*/}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/*---------------- User Routes ----------------*/}
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:id" element={<UserEdit />} />
      <Route path="/me" element={<UserEdit />} /> {/* Current user profile */}

      {/*---------------- Bug Routes -----------------*/}
      <Route path="/bugs" element={<BugListSummary />} />
      <Route path="/bugs/:id" element={<BugEdit />} />

      {/*---------------- Fallback ------------------*/}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
  // </QueryClientProvider>
);

export default App;
