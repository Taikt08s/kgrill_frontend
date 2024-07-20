import React, { useState } from 'react';
import { Box, Button, Modal, Typography, Snackbar } from '@mui/material';
import { FaBan } from "react-icons/fa";
import logo from '../../../../assets/images/logo.png';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alert from '@mui/material/Alert';

const BanUser = ({ user, refreshUser }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    const [formData, setFormData] = useState({
        id: user.user_id,
    });

    const handleSave = async () => {
        const token = Cookies.get('access_token');

        const payload = {
            account_not_locked: !user.account_not_locked, // Toggle the account_not_locked status
        };

        try {
            const response = await axios.put(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/admin/management/account?id=${formData.id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            handleClose();
            refreshUser({ ...user, account_not_locked: !user.account_not_locked }); // Update local user state


            setSnackbarMessage(user.account_not_locked ? 'Chặn' + ' thành công!' : 'Mở khóa' + ' thành công!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('API error:', error);
            setSnackbarMessage(user.account_not_locked ? 'Chặn' + 'thất bại!' : 'Mở khóa' + ' thất bại!');
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
            <Button className="secondary" color="secondary" onClick={handleOpen}>
                <FaBan />
            </Button>
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
                        <img src={logo} style={{ maxWidth: '120px', maxHeight: '120px', textAlign: 'center', marginTop: '-30px', marginBottom: '-20px' }} alt="Logo" />
                    </div>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Bạn có chắc chắn muốn {user.account_not_locked ? 'mở khóa' : 'chặn'} người dùng này không?
                    </Typography>
                    <Box mt={2} display="flex" justifyContent="center" >
                        <Button variant="contained" color="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#f45050', '&:hover': { backgroundColor: '#d43d3d' }, ml: 2 }}
                            onClick={handleSave}
                        >
                            {user.account_not_locked ? 'Chặn' : 'Mở khóa'}
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

export default BanUser;
