import React, { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import '../../../../App.css';
import logo from '../../../../assets/images/logo.png';
import { MdDeleteForever } from "react-icons/md";

const DeleteProduct = ({ user }) => {
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    ;

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSave = () => {
        // Logic to save changes goes here
        handleClose();
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    return (
        <>
            <Button className="error" color="error" onClick={handleOpen} ><MdDeleteForever /></Button>

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
                        <Button variant="contained" sx={{ backgroundColor: '#f45050', '&:hover': { backgroundColor: '#d43d3d' }, ml: 2 }} onClick={handleSave}>
                            Xóa
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default DeleteProduct;
