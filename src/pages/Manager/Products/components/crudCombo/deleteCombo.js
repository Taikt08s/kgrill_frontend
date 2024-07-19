import React, { useState } from 'react';
import { Box, Button, Modal, Typography, Snackbar } from '@mui/material';
import { MdDeleteForever } from "react-icons/md";
import axios from 'axios';
import Cookies from 'js-cookie';
import logo from '../../../../../assets/images/logo.png';
import Alert from '@mui/material/Alert';

const DeleteCombo = ({ productId, refreshData }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleDelete = async () => {
        const token = Cookies.get('access_token');
        try {
            await axios.delete(`https://kgrill-backend-xfzz.onrender.com/api/v1/food-package/delete/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            refreshData();
            handleClose();
            setSnackbarMessage('Xóa sản phẩm thành công!!!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage('Xóa sản phẩm thất bại!!!');
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
            <Button className="error" color="error" onClick={handleOpen}><MdDeleteForever /></Button>
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
                        Bạn có chắc chắn muốn xóa sản phẩm này không?
                    </Typography>
                    <Box mt={2} display="flex" justifyContent="flex-end" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: '#f45050', '&:hover': { backgroundColor: '#d43d3d' }, ml: 2 }} onClick={handleDelete}>
                            Xóa
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}>
                <Alert position="top-right" onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DeleteCombo;
