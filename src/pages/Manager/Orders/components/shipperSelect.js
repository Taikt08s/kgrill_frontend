import React, { useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { FaShippingFast } from "react-icons/fa";
import ConfirmShip from "./confirmShip"; // Đảm bảo import đúng tên component

const ShipperSelect = () => {
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleConfirmOpen = () => setConfirmOpen(true);
    const handleConfirmClose = () => {
        setConfirmOpen(false);
        handleClose(); // Đóng cả Modal ShipperSelect
    };

    const shipper = [
        {
            shipperID: '101', shipperName: 'Dinh Tin', shipperStatus: 'Đang Trống'
        },
        // Add more users here...
    ];

    return (
        <>
            <div className="actions">
                <Button className="success" color="success" onClick={handleOpen}>
                    <div className="info pl-0 d-flex align-items-center">
                        <FaShippingFast />
                    </div>
                </Button>
            </div>

            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    outline: 'none'
                }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        CHỌN NGƯỜI SHIP ĐƠN
                    </Typography>
                    <table className="table table-bordered v-align">
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ width: '100px', textAlign: 'center', verticalAlign: 'middle' }}>ID</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TÊN SHIPPER</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRẠNG THÁI</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipper.map((shipper, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{shipper.shipperID}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{shipper.shipperName}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{shipper.shipperStatus}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                        <Button variant="contained" color="secondary" onClick={handleConfirmOpen}>
                                            Giao Hàng
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Modal for ConfirmShip */}
            <ConfirmShip open={confirmOpen} handleClose={handleConfirmClose} />
        </>
    );
};

export default ShipperSelect;
