import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Typography, Snackbar, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import ShipperSelect from './components/shipperSelect';
import CancelOrder from './components/cancelOrder';
import AcceptOrder from './components/acceptOrder';
import axios from 'axios';
import Cookies from 'js-cookie';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const fetchOrders = async (pageNo = 0) => {
        const token = Cookies.get('access_token');
        try {
            const response = await axios.get(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/delivery-order/order-list?pageNo=${pageNo}&pageSize=10&sortBy=id&sortDir=asc`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'accept': '*/*'
                    }
                }
            );
            const data = response.data.data;
            setOrders(data.content);
            setPage(data.page_no);
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setSnackbarMessage('Đã xảy ra lỗi khi lấy danh sách đơn hàng');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handlePageChange = (event, value) => {
        fetchOrders(value - 1); // API pages are 0-indexed, but Pagination component is 1-indexed
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const refreshOrders = () => {
        fetchOrders(page);
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">DANH SÁCH ĐẶT HÀNG</h3>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ID</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TÊN KHÁCH HÀNG</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>MÓN ĐẶT</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ĐỊA CHỈ</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIÁ</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>THỜI GIAN</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>SỐ ĐIỆN THOẠI</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>SHIPPER GIAO ĐƠN</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRẠNG THÁI</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={index}>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Delivery_Order_Id}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.User_name}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {order.Package_name.join(', ')}
                                        </td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Address}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Order_value.toLocaleString('vi-VN')} VND</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{new Date(order.Order_date).toLocaleString()}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Phone}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Shipper_name}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {order.Order_status === "Processing" ? "Đang Xử Lý" :
                                                order.Order_status === "Preparing" ? "Đang Chuẩn Bị" :
                                                    order.Order_status === "Completed" ? "Hoàn Thành" :
                                                        order.Order_status}
                                        </td>
                                        <td>
                                            <div className="actions d-flex align-items-center" style={{ display: 'flex', justifyContent: 'center' }}>
                                                {order.Shipper_name === "Not assigned" && (
                                                    <>
                                                        {order.Order_status === "Processing" && <AcceptOrder orderId={order.Delivery_Order_Id} refreshOrders={refreshOrders} />}
                                                        {order.Order_status === "Preparing" && <ShipperSelect orderId={order.Delivery_Order_Id} refreshOrders={refreshOrders} />}
                                                    </>
                                                )}
                                                <CancelOrder orderId={order.Delivery_Order_Id} refreshOrders={refreshOrders} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        <div className="d-flex tableFooter">
                            <p>showing <b>{orders.length}</b> of <b>{orders.length * totalPages}</b> results</p>
                            <Pagination count={totalPages} page={page + 1} onChange={handlePageChange} color="error" className="pagination" showFirstButton showLastButton />
                        </div>
                    </div>
                </div>
            </div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Orders;
