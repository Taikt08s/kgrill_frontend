import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { FaAngleRight } from "react-icons/fa";
import { MdOutlineSpaceDashboard, MdOutlineDining } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers } from "react-icons/fa6";
import { logout } from '../../api/axios';
import { MdOutlineDeliveryDining } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { BiDish } from "react-icons/bi";


const Sidebar = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const tokenPayload = localStorage.getItem('decoded_payload');
        if (tokenPayload) {
            try {
                const payloadObj = JSON.parse(tokenPayload);
                setUserRole(payloadObj.role);
            } catch (e) {
                console.error('Error parsing token payload:', e);
            }
        }
    }, []);

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu);
    }

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert('Logout failed!');
        }
    };

    const adminSidebarItems = (
        <>
            <li>
                <Link to="/dashboard">
                    <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                        <span className='icon'><MdOutlineSpaceDashboard /></span>
                        Dashboard
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                </Link>
            </li>
            <li>
                <Link to="/Products">
                    <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                        <span className='icon'><MdOutlineDining /></span>
                        Sản Phẩm
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                </Link>
                <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                    <ul className='submenu'>
                        <li><Link to="/Products">Danh Sách Sản Phẩm</Link></li>
                        <li><Link to="/Revenue">Theo Dõi Doanh Thu</Link></li>
                    </ul>
                </div>
            </li>
            <li>
                <Link to="/ManageUser">
                    <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                        <span className='icon'><FaUsers /></span>
                        Tài Khoản
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                </Link>
            </li>
            <li>
                <Link to="/ShipperAdmin">
                    <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                        <span className='icon'><MdOutlineDeliveryDining /></span>
                        Shipper
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                </Link>
            </li>
        </>
    );

    const managerSidebarItems = (
        <>
            <li>
                <Link to="/dashboard">
                    <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                        <span className='icon'><MdOutlineSpaceDashboard /></span>
                        Dashboard
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                </Link>
            </li>
            <li>
                <Link to="/ProductsManager">
                    <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                        <span className='icon'><MdOutlineDining /></span>
                        Sản phẩm
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                </Link>
            </li>
            <li>
                <Link to="/Orders">
                    <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                        <span className='icon'><BiPackage /></span>
                        Orders
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                </Link>
            </li>
            <li>
                <Link to="/DishManager">
                    <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                        <span className='icon'><BiDish /></span>
                        Món Ăn
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                </Link>
            </li>
        </>
    );

    return (
        <div className="sidebar">
            <ul>
                {userRole === 'ADMIN' && adminSidebarItems}
                {userRole === 'MANAGER' && managerSidebarItems}
            </ul>

            <br />

            <div className='logoutWrapper'>
                <div className='logoutBox'>
                    <Button onClick={handleLogout} variant="contained"><IoLogOutOutline />Đăng xuất</Button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
