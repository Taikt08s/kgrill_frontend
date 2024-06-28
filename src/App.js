import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Dashboard from './pages/Dashboard/index';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { createContext, useEffect, useState } from 'react';
import Login from './pages/Login';
import Products from './pages/Products';
import ManageUser from './pages/ManageUser/Index';
import PrivateRoute from './pages/Login/PrivateRoute';
import NotFound from './pages/NotFound/index'
import Cookies from 'js-cookie';

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
              <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
              <Route path="/Products" element={<PrivateRoute element={<Products />} />} />
              <Route path="/ManageUser" element={<PrivateRoute element={<ManageUser />} />} />
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