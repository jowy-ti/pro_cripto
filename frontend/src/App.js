import HomePage from './pages/HomePage';

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
import GetStartedPage from './pages/GetStartedPage';
import ClientMenuPage from './pages/ClientMenuPage';
import ClaimTokensPage from './pages/ClaimTokensPage';
import BlockchainTransfer from './pages/TransferTokensPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/shoppage" element={<ShopPage />} /> 
          <Route path="/errorpage" element={<ErrorPage />} /> 
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/register" element={<RegisterPage />} /> 
          <Route path="/productmanagement" element={<ProductManagementPage />} /> 
          <Route path="/addproduct" element={<AddProductPage/>} />
          <Route path="/deleteproduct" element={<DeleteProductPage/>} />
          <Route path="/modifyproduct" element={<ModifyProductPage/>} />
          <Route path="/getstartedpage" element={<GetStartedPage />} />
          <Route path="/clientmenu" element={<ClientMenuPage/>}/>
          <Route path="/claim-tokens" element={<ClaimTokensPage />} />
          <Route path="/transfer-tokens" element={<BlockchainTransfer />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
