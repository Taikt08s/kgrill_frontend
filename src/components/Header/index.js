import React, { useContext, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import logo from '../../assets/images/logo.png';
import { MdRestaurantMenu } from "react-icons/md";
import { TiThMenu } from "react-icons/ti";
import Button from '@mui/material/Button';
import { CiLight } from "react-icons/ci";
import { IoMdCart } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { FaShieldAlt } from "react-icons/fa";
import Divider from '@mui/material/Divider';
import { MyContext } from '../../App';
import { refreshToken, logout } from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isOpennotificationsDrop, setisOpennotificationsDrop] = React.useState(null);
    const openMyAcc = Boolean(anchorEl);
    const openNotifications = Boolean(isOpennotificationsDrop);

    const context = useContext(MyContext);
    const navigate = useNavigate();

    const handleOpenMyAccDrop = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMyAccDr = () => {
        setAnchorEl(null);
    };

    const handleOpennotificationsDrop = () => {
        setisOpennotificationsDrop(true);
    }

    const handleClosenotificationsDrop = () => {
        setisOpennotificationsDrop(false);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            refreshToken().catch(() => {
                navigate('/login');
            });
        }, 15 * 60 * 1000); // Refresh token every 15 minutes

        return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert('Logout failed!');
        }
    };

    // Get the user information from local storage
    const getUserInfo = () => {
        const userInfo = localStorage.getItem('decoded_payload');
        return userInfo ? JSON.parse(userInfo) : { full_name: '', sub: '' };
    };

    const { full_name, sub } = getUserInfo();

    return (
        <>
            <header className="d-flex align-items-center">
                <div className="container-fluid w-100">
                    <div className="row d-flex align-items-center w-100">
                        {/* Logo Wrapper */}
                        <div className="col-sm-2 part1">
                            <Link to={'/dashboard'} className="d-flex align-items-center logo">
                                <img src={logo} />
                                <span className="ml-2">KGRILL</span>
                            </Link>
                        </div>

                        <div className="col-sm-3 d-flex align-items-center part2">
                            <Button className="rounded-circle mr-3" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
                                {
                                    context.isToggleSidebar === false ? <TiThMenu /> : <MdRestaurantMenu />
                                }
                            </Button>

                        </div>

                        <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
                            <Button className="rounded-circle mr-3"><CiLight /></Button>
                            <Button className="rounded-circle mr-3"><IoMdCart /></Button>
                            <Button className="rounded-circle mr-3"><MdEmail /></Button>

                            <div className='dropdownWrapper position-relative'>
                                <Button className="rounded-circle mr-3" onClick={handleOpennotificationsDrop}><FaBell /></Button>
                                <Menu
                                    anchorEl={isOpennotificationsDrop}
                                    className='notifications dropdown_list'
                                    id="notifications"
                                    open={openNotifications}
                                    onClose={handleClosenotificationsDrop}
                                    onClick={handleClosenotificationsDrop}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <div className='head pl-3 pb-0'>
                                        <h4>Order (12)</h4>
                                    </div>
                                    <Divider className='mb-3' />
                                    <MenuItem onClick={handleClosenotificationsDrop}>
                                        <div className='d-flex align-items-center'>
                                            <span className='rounded-circle'>

                                            </span>
                                        </div>
                                    </MenuItem>
                                </Menu>
                            </div>

                            {
                                context.isLogin !== true ?
                                    <Link to={'/login'}><Button className='btn-blue btn-lg btn-round'>Sign In</Button></Link>
                                    :
                                    <div className="myAccWrapper">
                                        <Button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDrop}>
                                            <div className="userImg">
                                                <span className="rounded-circle">
                                                    <img src="https://clipground.com/images/admin-png-12.png" />
                                                </span>
                                            </div>
                                            <div className="userInfor">
                                                <h4>{full_name}</h4>
                                                <p className="mb-0">{sub}</p>
                                            </div>
                                        </Button>

                                        <Menu
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={openMyAcc}
                                            onClose={handleCloseMyAccDr}
                                            onClick={handleCloseMyAccDr}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >
                                            <MenuItem onClick={handleCloseMyAccDr}>
                                                <ListItemIcon>
                                                    <PersonAdd fontSize="small" />
                                                </ListItemIcon>
                                                Hồ sơ
                                            </MenuItem>
                                            <MenuItem onClick={handleCloseMyAccDr}>
                                                <ListItemIcon>
                                                    <FaShieldAlt />
                                                </ListItemIcon>
                                                Đặt lại mật khẩu
                                            </MenuItem>
                                            <MenuItem onClick={handleCloseMyAccDr}>
                                                <ListItemIcon>
                                                    <Settings fontSize="small" />
                                                </ListItemIcon>
                                                Cài đặt
                                            </MenuItem>
                                            <MenuItem onClick={handleLogout}>
                                                <ListItemIcon>
                                                    <Logout fontSize="small" />
                                                </ListItemIcon>
                                                Đăng xuất
                                            </MenuItem>
                                        </Menu>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
