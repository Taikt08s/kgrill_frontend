import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Typography, Pagination } from '@mui/material';
import { RiBillLine } from "react-icons/ri";
import axios from 'axios';
import Cookies from 'js-cookie';
import logo from '../../../../assets/images/logo.png';

const DetailBill = ({ date, period }) => {
    const [open, setOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const formatDate = (date, period) => {
        const year = new Date(date).getFullYear();
        const month = new Date(date).getMonth() + 1; // Months are zero-based
        if (period === 'yearly') {
            return `${year}-01-01`;
        } else if (period === 'monthly') {
            return `${year}-${month.toString().padStart(2, '0')}-01`;
        }
        return date; // Return the date as is for other periods
    };

    const fetchOrderDetails = async (pageNumber) => {
        setLoading(true);
        try {
            const token = Cookies.get('access_token');
            const formattedDate = formatDate(date, period);
            const response = await axios.get(
                'https://kgrill-backend-xfzz.onrender.com/api/v1/admin/revenue-details',
                {
                    params: {
                        date: formattedDate,
                        period: period,
                        pageNo: pageNumber,
                        pageSize: pageSize,
                        sortBy: 'orderDate',
                        sortDir: 'asc'
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = response.data.data;
            setOrderDetails(data.content);
            setTotalPages(data.total_pages);
            setTotalElements(data.total_elements);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching order details:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchOrderDetails(page);
        }
    }, [open, page]);

    const handleOpen = () => {
        setOpen(true);
        fetchOrderDetails(page);
    };

    const handleClose = () => setOpen(false);

    const handlePageChange = (event, value) => {
        setPage(value - 1); // MUI Pagination is 1-based, API is 0-based
    };

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
                    <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
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
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Delivery_shipped_date ? new Date(order.Delivery_shipped_date).toLocaleTimeString() : 'N/A'}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Shipper_name}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Delivery_order_value.toLocaleString('vi-VN')} VND</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="d-flex tableFooter">
                            <p>showing <b>{orderDetails.length}</b> of <b>{totalElements}</b> results</p>
                            <Pagination
                                count={totalPages}
                                page={page + 1} // MUI Pagination is 1-based
                                onChange={handlePageChange}
                                color="error"
                                className="pagination"
                                showFirstButton
                                showLastButton
                            />
                        </div>
                    </Box>

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
