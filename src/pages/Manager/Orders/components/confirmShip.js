import React, { useState } from 'react';
import { Box, Button, Modal, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import logo from '../../../../assets/images/logo.png';

const ConfirmShip = ({ open, handleClose, orderId, shipperId, shipperName, refreshOrders }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleSave = async () => {
        const token = Cookies.get('access_token');
        try {
            await axios.get(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/shipper/assign-shipper?shipperId=${shipperId}&orderId=${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'accept': '*/*'
                    }
                }
            );
            setSnackbarMessage('Giao đơn cho Shipper thành công!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            refreshOrders(); // Refresh orders after assigning shipper
        } catch (error) {
            console.error('Error assigning shipper:', error);
            setSnackbarMessage('Giao đơn cho Shipper thất bại!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
        handleClose(); // Close both modals
    };

    return (
        <>
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
                        Bạn có chắc chắn muốn {shipperName} giao đơn này không?
                    </Typography>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: '#f45050', '&:hover': { backgroundColor: '#d43d3d' }, ml: 2 }} onClick={handleSave}>
                            Đồng ý
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

export default ConfirmShip;
