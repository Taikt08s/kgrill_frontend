import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Dashboard from './pages/Dashboard/index';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { createContext, useEffect, useState } from 'react';
import Login from './pages/Login';
import Products from './pages/Admin/Products';
import ManageUser from './pages/Admin/ManageUser/Index';
import PrivateRoute from './pages/Login/PrivateRoute';
import NotFound from './pages/NotFound/index';
import ShipperAdmin from './pages/Admin/ShipperAdmin';
import Revenue from './pages/Admin/Products/revenue';
import Tracking from './pages/Admin/Products/trackingItem';
import Orders from './pages/Manager/Orders';
import ProductsManager from './pages/Manager/Products';
import DishManager from './pages/Manager/Products/Dish';
import ShipperManager from './pages/Manager/ShipperManage';
import { Helmet } from "react-helmet";

const MyContext = createContext();

function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem('access_token'));
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);

  useEffect(() => {
    setIsLogin(!!localStorage.getItem('access_token'));
  }, []);

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader
  };

  return (
    <BrowserRouter>
      <Helmet>
        <meta charSet="utf-8" />
        <title>KGRILL</title>
        <link rel="canonical" href="http://mysite.com/example" />
        <meta name="description" content="Helmet application" />
      </Helmet>
      <MyContext.Provider value={values}>
        {!isHideSidebarAndHeader && isLogin && <Header />}
        <div className='main d-flex'>
          {!isHideSidebarAndHeader && isLogin && (
            <div className={`sidebarWrapper ${isToggleSidebar ? 'toggle' : ''}`}>
              <Sidebar />
            </div>
          )}
          <div className={`content ${isHideSidebarAndHeader ? 'full' : ''} ${isToggleSidebar ? 'toggle' : ''}`}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} requiredRoles={['ADMIN', 'MANAGER']} />} />
              <Route path="/Products" element={<PrivateRoute element={<Products />} requiredRoles={['ADMIN']} />} />
              <Route path="/ManageUser" element={<PrivateRoute element={<ManageUser />} requiredRoles={['ADMIN']} />} />
              <Route path="/Revenue" element={<PrivateRoute element={<Revenue />} requiredRoles={['ADMIN', 'MANAGER']} />} />
              <Route path="/Tracking" element={<PrivateRoute element={<Tracking />} requiredRoles={['ADMIN']} />} />
              <Route path="/ShipperAdmin" element={<PrivateRoute element={<ShipperAdmin />} requiredRoles={['ADMIN']} />} />
              <Route path="/Orders" element={<PrivateRoute element={<Orders />} requiredRoles={['MANAGER']} />} />
              <Route path="/ProductsManager" element={<PrivateRoute element={<ProductsManager />} requiredRoles={['MANAGER']} />} />
              <Route path="/DishManager" element={<PrivateRoute element={<DishManager />} requiredRoles={['MANAGER']} />} />
              <Route path="/ShipperManager" element={<PrivateRoute element={<ShipperManager />} requiredRoles={['MANAGER']} />} />
              <Route path="/unauthorized" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };
