import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, MenuItem, Select, InputLabel, FormControl, Snackbar } from '@mui/material';
import { MdOutlineModeEdit } from "react-icons/md";
import axios from 'axios';
import Cookies from 'js-cookie';
import logo from '../../../../assets/images/logo.png';
import Alert from '@mui/material/Alert';

const EditUser = ({ user, refreshUser }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        console.log('handleSave called');
        const token = Cookies.get('access_token');

        const payload = {
            role: formData.role // Only change role information
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
            refreshUser({ ...user, role: formData.role }); // Refresh the user data in the parent component
            handleClose();
            setSnackbarMessage('Cập nhật thành công');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Error updating user:', error);
            setSnackbarMessage('Cập nhật thất bại');
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
            <Button className="success" color="success" onClick={handleOpen}><MdOutlineModeEdit /></Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
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
                        <img src={logo} style={{ maxWidth: '120px', maxHeight: '120px', textAlign: 'center', marginTop: '-30px', marginBottom: '-20px' }} alt="logo" />
                    </div>

                    <Typography id="modal-title" variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Chỉnh sửa thông tin
                    </Typography>

                    <form>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Họ"
                            name="firstName"
                            value={formData.firstName}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Tên"
                            name="lastName"
                            value={formData.lastName}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                        />
                        <FormControl fullWidth margin="normal" variant="outlined">
                            <InputLabel>Chức Vụ</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                label="Chức Vụ"
                            >
                                <MenuItem value="MANAGER">Manager</MenuItem>
                                <MenuItem value="SHIPPER">Shipper</MenuItem>
                                <MenuItem value="USER">User</MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: '#f45050', '&:hover': { backgroundColor: '#d43d3d' }, ml: 2 }} onClick={handleSave}>
                            Lưu Thay Đổi
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

export default EditUser;
