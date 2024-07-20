import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Box, Button, Modal, Typography, Pagination, Snackbar } from '@mui/material';
import '../../../../App.css';
import logo from '../../../../assets/images/logo.png';
import { RiBillLine } from "react-icons/ri";
import Alert from '@mui/material/Alert';

const DetailProduct = ({ shipperId }) => {
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0); // Start with 0 to match API's page number
    const [pageSize, setPageSize] = useState(10); // Default page size
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fetchOrderDetails = async (pageNumber) => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.get(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/admin/shipper-tracking/detail`,
                {
                    params: {
                        pageNo: pageNumber,
                        pageSize: pageSize,
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
            setTotalPages(data.total_pages);
            setTotalElements(data.total_elements);
        } catch (error) {
            console.error('Error fetching order details:', error);
            setSnackbarMessage('Error fetching order details');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        if (open) {
            fetchOrderDetails(page);
        }
    }, [open, shipperId, page]);

    const handlePageChange = (event, value) => {
        setPage(value - 1); // MUI Pagination is 1-based, API is 0-based
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

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
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Delivery_shipped_date ? new Date(order.Delivery_shipped_date).toLocaleString() : 'N/A'}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Shipper_name}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.Delivery_order_value.toLocaleString('vi-VN')} VND</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex tableFooter">
                            <p>showing <b>{orders.length}</b> of <b>{totalElements}</b> results</p>
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
                    </div>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DetailProduct;
