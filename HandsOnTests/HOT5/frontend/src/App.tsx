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
import LoginForm from "./components/pages/LoginForm";
import RegisterForm from "./components/pages/SignUpForm";
import NotFound from "./components/pages/NotFound";

//|====================================================================================================|
//|----------------------------------------------[-Main-]----------------------------------------------|
//|====================================================================================================|
const App = () => (
  <TooltipProvider>
    <Sonner />
    <Routes>
      {/* Login Routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* User Routes */}
      <Route path="/users/:id" element={<UserPage />} />
      <Route path="/me" element={<UserMePage />} />
      <Route path="/me/edit" element={<UserEdit />} />

      {/* Product Routes */}
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductPage />} />

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  </TooltipProvider>
);

export default App;
