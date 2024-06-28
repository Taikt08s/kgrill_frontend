import React, { useState } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FaEye } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import SearchBox from '../../components/SearchBox';
import EditUser from './Components/Edit';
import { IoMdAdd } from "react-icons/io";
import Delete from './Components/Delete';
import AddUser from './Components/AddUser';

const ManageUser = () => {
    const [showBy, setshowBy] = useState('');
    const [showBysetRole, setshowBysetRole] = useState('');

    const users = [
        { id: 1, fullName: 'Dinh Tin', email: 'dtcoder308@gmail.com', Address: 'khu công nghệ cao Hòa Lạc – Km29, ĐCT08, Thạch Hoà, Thạch Thất, Hà Nội', role: 'Admin' },
        // Add more users here...
    ];

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="hd">All User</h3>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <SearchBox />
                        <AddUser />


                    </div>


                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>HỌ VÀ TÊN</th>
                                    <th style={{ width: '300px' }}>EMAIL</th>
                                    <th style={{ width: '300px' }}>ĐỊA CHỈ</th>
                                    <th style={{ width: '200px' }}>ROLE</th>
                                    <th>HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.id}</td>
                                        <td>
                                            <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img">
                                                        <img src="https://nauankhongkho.com/wp-content/uploads/2015/11/lau-de-1.jpg" className="w-100" alt="user avatar" />
                                                    </div>
                                                </div>
                                                <div className="info pl-0">
                                                    <h6>{user.fullName}</h6>
                                                    <p>Doan</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.Address}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <div className="actions d-flex align-items-center">
                                                <Button className="secondary" color="secondary"><FaEye /></Button>
                                                <EditUser user={user} />
                                                <Delete />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex tableFooter">
                            <p>showing <b>12</b> of <b>60</b> results</p>
                            <Pagination count={10} color="error" className="pagination" showFirstButton showLastButton />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManageUser;
