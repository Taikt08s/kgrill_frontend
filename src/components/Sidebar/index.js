import Button from '@mui/material/Button';
import { FaAngleRight } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdOutlineDining } from "react-icons/md";
import { TiShoppingCart } from "react-icons/ti";
import { LuMessagesSquare } from "react-icons/lu";
import { LuBellRing } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { IoLogOutOutline } from "react-icons/io5";





const Sidebar = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu);
    }

    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                                <span className='icon'><MdOutlineSpaceDashboard /></span>
                                Dashboard
                                <span className='arrow'><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>

                        <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                            <span className='icon'><MdOutlineDining /></span>
                            Products
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><Link to="#">Product List</Link></li>
                                <li><Link to="#">Product View</Link></li>
                                <li><Link to="#">Product Upload</Link></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                            <span className='icon'><TiShoppingCart /></span>
                            Orders
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
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
                    <li>
                        <Button className='w-100'>
                            <span className='icon'><MdOutlineSpaceDashboard /></span>
                            Dashboard
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                    </li>
                    <li>
                        <Button className='w-100'>
                            <span className='icon'><MdOutlineDining /></span>
                            Products
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                    </li>
                    <li>
                        <Button className='w-100'>
                            <span className='icon'><TiShoppingCart /></span>
                            Orders
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                    </li>
                    <li>
                        <Button className='w-100'>
                            <span className='icon'><LuMessagesSquare /></span>
                            Messages
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                    </li>
                    <li>
                        <Button className='w-100'>
                            <span className='icon'><LuBellRing /></span>
                            Notifications
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                    </li>
                    <li>
                        <Button className='w-100'>
                            <span className='icon'><IoSettingsOutline /></span>
                            Setting
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                    </li>
                    <li>
                        <Button className='w-100'>
                            <span className='icon'><LuBellRing /></span>
                            Notifications
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                    </li>
                    <li>
                        <Button className='w-100'>
                            <span className='icon'><IoSettingsOutline /></span>
                            Setting
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                    </li>
                </ul>

                <br />

                <div className='logoutWrapper'>
                    <div className='logoutBox'>
                        <Button variant="contained" ><IoLogOutOutline />Logout</Button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Sidebar