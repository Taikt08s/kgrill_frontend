import React, { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { RiBillLine } from "react-icons/ri";
import axios from 'axios';
import Cookies from 'js-cookie';
import logo from '../../../../assets/images/logo.png';

const DetailBill = ({ date, period }) => {
    const [open, setOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOpen = async () => {
        setOpen(true);
        setLoading(true);
        try {
            const token = Cookies.get('access_token');
            const response = await axios.get(
                'https://kgrill-backend-xfzz.onrender.com/api/v1/admin/revenue-details',
                {
                    params: {
                        date: date,
                        period: period,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            // Assuming response.data.data.content is an array of objects
            if (Array.isArray(response.data.data.content)) {
                setOrderDetails(response.data.data.content);
            } else {
                console.error('API response content is not an array:', response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching order details:', error);
            setLoading(false);
        }
    };

    const handleClose = () => setOpen(false);

    return (
        <>
            <div className="actionschitiet">
                <Button className="secondary" color="secondary" onClick={handleOpen}>
                    <div className="info pl-0 d-flex align-items-center">
                        <RiBillLine />
                        <p style={{ textAlign: 'center', verticalAlign: 'middle' }}>Chi Tiết</p>
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
                        <img src={logo} style={{ maxWidth: '120px', maxHeight: '120px', textAlign: 'center', marginTop: '-30px', marginBottom: '-20px' }} alt="Logo" />
                    </div>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        CHI TIẾT ĐƠN HÀNG
                    </Typography>
                    <table className="table table-bordered v-align">
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ width: '100px', textAlign: 'center', verticalAlign: 'middle' }}>ID</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TÊN KHÁCH HÀNG</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TÊN COMBO</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRẠNG THÁI</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIỜ NHẬP ĐƠN</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIỜ GIAO TỚI</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TÊN SHIPPER</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIÁ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', verticalAlign: 'middle' }}>Loading...</td>
                                </tr>
                            ) : (
                                orderDetails.map((order, index) => (
                                    <tr key={index}>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Delivery_order_id}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.User_name}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Package_name.join(', ')}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Delivery_order_status}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{new Date(order.Delivery_order_date).toLocaleTimeString()}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{new Date(order.Delivery_shipped_date).toLocaleTimeString()}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Shipper_name}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Delivery_order_value.toLocaleString('vi-VN')} VND</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

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

export default DetailBill;
