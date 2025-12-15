//|====================================================================================================|
//|----------------------------------------------[-Imports-]-------------------------------------------|
//|====================================================================================================|
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
//|====================================================|
//|---------------------[-Users-]----------------------|
//|====================================================|
import UserPage from "./components/pages/UserPage";
import UserEdit from "./components/pages/UserEdit";
import UserMePage from "./components/pages/UserMePage";

//|====================================================|
//|--------------------[-Products-]--------------------|
//|====================================================|
import ProductList from "./components/pages/ProductList";
import ProductPage from "./components/pages/ProductPage";

//|====================================================|
//|------------------[-Auth & misc-]-------------------|
//|====================================================|
import Dashboard from "./components/pages/Dashboard";
import LoginForm from "./components/pages/LoginForm";
import RegisterForm from "./components/pages/SignUpForm";
import NotFound from "./components/pages/NotFound";
import Layout from "./components/Layout";

//|====================================================================================================|
//|----------------------------------------------[-Main-]----------------------------------------------|
//|====================================================================================================|
const App = () => (
  <TooltipProvider>
    <Sonner />
    <Routes>
      {/* No Layout */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* With Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/" element={<Dashboard/>} />
        <Route path="/users/:id?" element={<UserPage />} />
        <Route path="user/me" element={<UserMePage />} />
        <Route path="/me/edit" element={<UserEdit />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id?" element={<ProductList />} />
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
)


export default App;
