import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Box, Button, Modal, Typography } from '@mui/material';
import '../../../../App.css';
import logo from '../../../../assets/images/logo.png';
import { RiBillLine } from "react-icons/ri";

const DetailProduct = ({ shipperId }) => {
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fetchOrderDetails = async () => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.get(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/admin/shipper-tracking/detail`,
                {
                    params: {
                        pageNo: 0,
                        pageSize: 10,
                        sortBy: 'id',
                        sortDir: 'asc',
                        shipperId: shipperId,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = response.data.data;
            setOrders(data.content);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchOrderDetails();
        }
    }, [open, shipperId]);

    return (
        <>
            <div className="actions">
                <Button className="secondary" color="secondary" onClick={handleOpen}>
                    <div className="info pl-0 d-flex align-items-center">
                        <RiBillLine />
                    </div>
                </Button>
            </div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    outline: 'none'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={logo} style={{ maxWidth: '120px', maxHeight: '120px', textAlign: 'center', marginTop: '-30px', marginBottom: '-20px' }} />
                    </div>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        CHI TIẾT ĐƠN HÀNG
                    </Typography>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ width: '100px', textAlign: 'center', verticalAlign: 'middle' }}>ID</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TÊN KHÁCH HÀNG</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ĐƠN HÀNG</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRẠNG THÁI</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIỜ NHẬP ĐƠN</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIỜ GIAO TỚI</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TÊN SHIPPER</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIÁ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={index}>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Delivery_order_id}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.User_name}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Package_name.join(', ')}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Delivery_order_status}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{new Date(order.Delivery_order_date).toLocaleString()}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{new Date(order.Delivery_shipped_date).toLocaleString()}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Shipper_name}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Delivery_order_value.toLocaleString('vi-VN')} VND</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default DetailProduct;
