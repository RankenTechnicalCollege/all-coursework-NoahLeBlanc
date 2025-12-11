import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
/*import { QueryClient, QueryClientProvider } from "@tanstack/react-query";*/
import { BrowserRouter, Routes, Route } from "react-router-dom";
/*
import Index from "./components/pages/Index";
import NotFound from "./components/pages/NotFound";
import BugList from "./components/pages/bugList";
import { UserList } from "./components/pages/userList";
import BugEdit from "./components/pages/bugEdit";
import UserEdit from "./components/pages/userEdit";
*/
import LoginForm from "./components/pages/LoginForm";
const App = () => (
  /*<QueryClientProvider client={queryClient}>*/
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/*<Route path="/" element={<Index />} />*/}
          <Route path="/LoginForm" element={<LoginForm/>} />
          {/*
          <Route path="/BugList" element={<BugList />} />
          <Route path="/UserList" element={<UserList />} />
          <Route path="/BugEdit" element={<BugEdit/>} />
          <Route path="/UserEdit" element={<UserEdit/>} />
          <Route path="*" element={<NotFound />} />
          */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  /*</QueryClientProvider>*/
);

export default App;
