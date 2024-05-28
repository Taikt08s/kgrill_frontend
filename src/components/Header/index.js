import React, { useState } from 'react';
import { Link } from "react-router-dom";
import logo from '../../assets/images/logo.jpg';
import { MdRestaurantMenu } from "react-icons/md";
import { TiThMenu } from "react-icons/ti";
import Button from '@mui/material/Button';
import SearchBox from "../SearchBox";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { IoMdCart } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { FaShieldAlt } from "react-icons/fa";
import Divider from '@mui/material/Divider';


const Header = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isOpennotificationsDrop, setisOpennotificationsDrop] = React.useState(null);
    const openMyAcc = Boolean(anchorEl);
    const openNotifications = Boolean(isOpennotificationsDrop);
    const handleOpenMyAccDrop = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMyAccDr = () => {
        setAnchorEl(null);
    };

    const handleOpennotificationsDrop = () => {
        setisOpennotificationsDrop(true)
    }

    const handleClosenotificationsDrop = () => {
        setisOpennotificationsDrop(false)
    }

    return (
        <>
            <header className="d-flex align-items-center">
                <div className="container-fluid w-100">
                    <div className="row d-flex align-items-center w-100">
                        {/*Logo Wraoore */}
                        <div className="col-sm-2 part1">
                            <Link to={'/'} className="d-flex align-items-center logo">
                                <img src={logo} />
                                <span className="ml-2">KGRILL</span>
                            </Link>
                        </div>

                        <div className="col-sm-3 d-flex align-items-center part2 pl-4">
                            <Button className="rounded-circle mr-3"><TiThMenu /></Button>
                            <SearchBox />
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

                            <div className="myAccWrapper">
                                <Button className="myAcc d-flex align-items-center"
                                    onClick={handleOpenMyAccDrop}>
                                    <div className="userImg">
                                        <span className="rounded-circle">
                                            <img src="https://clipground.com/images/admin-png-12.png" />
                                        </span>
                                    </div>

                                    <div className="userInfor">
                                        <h4>Doan Dinh Tin</h4>
                                        <p className="mb-0">@tindinh00</p>
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
                                        My Account
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseMyAccDr}>
                                        <ListItemIcon>
                                            <FaShieldAlt />
                                        </ListItemIcon>
                                        Reset Password
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseMyAccDr}>
                                        <ListItemIcon>
                                            <Settings fontSize="small" />
                                        </ListItemIcon>
                                        Settings
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseMyAccDr}>
                                        <ListItemIcon>
                                            <Logout fontSize="small" />
                                        </ListItemIcon>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </div>
                        </div>

                    </div>
                </div>
            </header>
        </>
    )
}
export default Header;