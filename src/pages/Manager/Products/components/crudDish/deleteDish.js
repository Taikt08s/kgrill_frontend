// components/crudDish/deleteDish.jsx
import React, { useState } from 'react';
import { Button, Modal, Box, Typography, Snackbar } from '@mui/material';
import { MdDeleteForever } from 'react-icons/md';
import axios from 'axios';
import Cookies from 'js-cookie';
import Alert from '@mui/material/Alert';

const DeleteDish = ({ product, refreshData }) => {
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.delete(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/dish/${product.dish_id}/delete`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setSnackbarMessage('Món ăn đã được xóa thành công!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            refreshData();
        }


        catch (error) {
            console.error('Error deleting dish:', error);
            setSnackbarMessage('Đã xảy ra lỗi khi xóa món ăn');
            setSnackbarSeverity('error');
            setSnackbarOpen(true); // Open snackbar if deletion fails
        } finally {
            handleClose();
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
            <Button className="error" color="error" onClick={handleOpen}>
                <MdDeleteForever />
            </Button>

            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        outline: 'none',
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        sx={{ textAlign: 'center', fontWeight: 'bold' }}
                    >
                        Bạn có chắc chắn muốn xóa món ăn {product.dish_name} không?
                    </Typography>
                    <Box mt={2} display="flex" justifyContent="center">
                        <Button variant="contained" color="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#f45050', '&:hover': { backgroundColor: '#d43d3d' }, ml: 2 }}
                            onClick={handleSave}
                        >
                            Xóa
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

export default DeleteDish;
