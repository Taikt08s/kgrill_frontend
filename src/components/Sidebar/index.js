import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { FaAngleRight } from "react-icons/fa";
import { MdOutlineSpaceDashboard, MdOutlineDining } from "react-icons/md";
import { TiShoppingCart } from "react-icons/ti";
import { LuMessagesSquare, LuBellRing } from "react-icons/lu";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers } from "react-icons/fa6";
import { logout } from '../../api/axios';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode

const Sidebar = (decodedPayload) => {
    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const tokenPayload = localStorage.getItem('decoded_payload');
        const payloadObj = JSON.parse(tokenPayload);
        const role = payloadObj.role;
        setUserRole(role);

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
                        Products
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                </Link>
                <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                    <ul className='submenu'>
                        <li><Link to="#">Product List</Link></li>
                        <li><Link to="#">Product View</Link></li>
                        <li><Link to="#">Product Upload</Link></li>
                    </ul>
                </div>
            </li>
            <li>
                <Link to="/ManageUser">
                    <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                        <span className='icon'><FaUsers /></span>
                        Manage User
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                </Link>
            </li>
            <li>
                <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                    <span className='icon'><LuMessagesSquare /></span>
                    Messages
                    <span className='arrow'><FaAngleRight /></span>
                </Button>
            </li>
            <li>
                <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                    <span className='icon'><LuBellRing /></span>
                    Notifications
                    <span className='arrow'><FaAngleRight /></span>
                </Button>
            </li>
            <li>
                <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                    <span className='icon'><IoSettingsOutline /></span>
                    Setting
                    <span className='arrow'><FaAngleRight /></span>
                </Button>
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
                <Link to="/Products">
                    <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                        <span className='icon'><MdOutlineDining /></span>
                        Products
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                </Link>
            </li>
            <li>
                <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                    <span className='icon'><LuMessagesSquare /></span>
                    Messages
                    <span className='arrow'><FaAngleRight /></span>
                </Button>
            </li>
            <li>
                <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                    <span className='icon'><LuBellRing /></span>
                    Notifications
                    <span className='arrow'><FaAngleRight /></span>
                </Button>
            </li>
        </>
    );

    return (
        <>
            <div className="sidebar">
                <ul>
                    {userRole === 'ADMIN' && adminSidebarItems}
                    {userRole === 'MANAGER' && managerSidebarItems}
                </ul>

                <br />

                <div className='logoutWrapper'>
                    <div className='logoutBox'>
                        <Button onClick={handleLogout} variant="contained"><IoLogOutOutline />Logout</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar;
