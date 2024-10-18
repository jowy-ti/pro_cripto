//import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProductManagementPage from './pages/ProductManagementPage';
import ShopPage from './pages/ShopPage';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/shoppage" element={<ShopPage />} /> 
          {/*<Route element={<ProtectedRoute />}>*/}
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/register" element={<RegisterPage />} /> 
            <Route path="/productmanagement" element={<ProductManagementPage />} /> 
          {/*</Route>*/}
        </Routes>
      </header>
    </div>
  );
}

export default App;
