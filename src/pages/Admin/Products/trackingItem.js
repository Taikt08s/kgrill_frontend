import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import SearchBox from '../../../components/SearchBox';

const Tracking = () => {
    const [showBy, setshowBy] = useState('');
    const [showBysetRole, setshowBysetRole] = useState('');

    const users = [
        {
            id: '101', comboName: "ABC", totalOrders: '150', CompletedOrders: '140', CompletionPercentage: '93.3%', CanceledOrders: '10', CancellationPercentage: '6.7%'
        },
    ];

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="hd">THEO DÕI MẶT HÀNG</h3>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <SearchBox />
                    </div>


                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ width: '100px', textAlign: 'center', verticalAlign: 'middle' }}>ID</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TÊN MẶT HÀNG</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }} >TỔNG ĐƠN ĐẶT</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ĐƠN HOÀN THÀNH</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TỈ LỆ HOÀN THÀNH</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ĐƠN HỦY</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TỈ LỆ HỦY ĐƠN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.id}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.comboName}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.totalOrders}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.CompletedOrders}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.CompletionPercentage}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.CanceledOrders}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.CancellationPercentage}</td>
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
            </div >
        </>
    );
}

export default Tracking;
