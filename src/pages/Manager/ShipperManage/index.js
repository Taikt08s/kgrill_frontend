import React, { useState } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FaEye } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import SearchBox from '../../../components/SearchBox';
import ListBill from './components/ListBillShipper';


const ShipperManager = () => {
    const [showBy, setshowBy] = useState('');
    const [showBysetRole, setshowBysetRole] = useState('');

    const users = [
        { shipperid: 1, shipperName: 'Dinh Tin', totalorders: '100', completedorders: '80', completionpercentage: '80%	', canceledorders: '20', cancellationpercentage: '20%' },
    ];

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="hd">SHIPPER</h3>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <SearchBox />
                    </div>


                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ID</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>HỌ VÀ TÊN</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TỔNG SỐ ĐƠN</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ĐƠN ĐÃ HOÀN THÀNH</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TỈ LỆ HOÀN THÀNH</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ĐƠN ĐÃ HỦY</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TỈ LỆ HỦY</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {user.shipperid}
                                        </td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <div className="info pl-0" >
                                                <h6>{user.shipperName}</h6>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.totalorders}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.completedorders}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.completionpercentage}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.canceledorders}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.cancellationpercentage}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <div className="actions d-flex align-items-center" style={{ display: 'flex', justifyContent: 'center' }}>
                                                <ListBill />
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
export default ShipperManager;