import React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { FaShippingFast } from "react-icons/fa";
import logo from '../../../../assets/images/logo.png';

const ConfirmShip = ({ open, handleClose }) => {

    const handleSave = () => {
        // Logic to save changes goes here
        handleClose(); // Đóng cả hai Modal khi nhấn Đồng ý
    };

    return (
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
                    Bạn có chắc chắn muốn Tin Dinh giao đơn này không?
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
    );
};

export default ConfirmShip;
