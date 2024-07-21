import React, { useState } from 'react';
import { Box, Button, Modal, Typography, Snackbar, Alert } from '@mui/material';
import { GiCancel } from "react-icons/gi";
import axios from 'axios';
import Cookies from 'js-cookie';
import logo from '../../../../assets/images/logo.png';

const CancelOrder = ({ orderId, refreshOrders }) => {
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        const token = Cookies.get('access_token');
        try {
            await axios.get(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/delivery-order/oder-cancellation/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'accept': '*/*'
                    }
                }
            );
            setSnackbarMessage('Đơn hàng đã được từ chối thành công');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            refreshOrders(); // Refresh the orders list
            handleClose();
        } catch (error) {
            console.error('Error cancelling order:', error);
            setSnackbarMessage('Đã xảy ra lỗi khi từ chối đơn hàng');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <>
            <Button className="error" color="error" onClick={handleOpen}><GiCancel /></Button>

            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
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
                        Bạn có chắc chắn muốn từ chối đơn này không?
                    </Typography>
                    <Box mt={2} display="flex" justifyContent="flex-end" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: '#f45050', '&:hover': { backgroundColor: '#d43d3d' }, ml: 2 }} onClick={handleSave}>
                            Từ Chối
                        </Button>
                    </Box>
                </Box>
            </Modal>

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

export default CancelOrder;
