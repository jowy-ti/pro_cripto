//import './App.css';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProductManagementPage from './pages/ProductManagementPage';
import ShopPage from './pages/ShopPage';
import ModifyProductPage from './pages/ModifyProductPage';
import AddProductPage from './pages/AddProductPage';
import DeleteProductPage from './pages/DeleteProductPage';
import ErrorPage from './pages/ErrorPage';
import NetworkConfigurationPage from './pages/NetworkConfigurationPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/shoppage" element={<ShopPage />} /> 
          <Route path="/errorpage" element={<ErrorPage />} /> 
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/register" element={<RegisterPage />} /> 
          <Route path="/productmanagement" element={<ProductManagementPage />} /> 
          <Route path="/addproduct" element={<AddProductPage/>} />
          <Route path="/deleteproduct" element={<DeleteProductPage/>} />
          <Route path="/modifyproduct" element={<ModifyProductPage/>} />
          <Route path="/network-configuration" element={<NetworkConfigurationPage />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
