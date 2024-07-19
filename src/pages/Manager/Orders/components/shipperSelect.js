import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Box, Button, Modal, Typography } from '@mui/material';
import { FaShippingFast } from "react-icons/fa";
import ConfirmShip from "./confirmShip"; // Đảm bảo import đúng tên component

const ShipperSelect = ({ orderId, refreshOrders }) => {
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedShipper, setSelectedShipper] = useState(null);
    const [selectedShipperName, setSelectedShipperName] = useState('');
    const [shippers, setShippers] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleConfirmOpen = (shipperId, shipperName) => {
        setSelectedShipper(shipperId);
        setSelectedShipperName(shipperName);
        setConfirmOpen(true);
    };
    const handleConfirmClose = () => {
        setConfirmOpen(false);
        handleClose(); // Đóng cả Modal ShipperSelect
    };

    useEffect(() => {
        const fetchShippers = async () => {
            const token = Cookies.get('access_token');
            try {
                const response = await axios.get(
                    'https://kgrill-backend-xfzz.onrender.com/api/v1/shipper/available-shippers?pageNumber=1&pageSize=10&sortField=id&sortDir=asc',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'accept': '*/*'
                        }
                    }
                );
                setShippers(response.data.data.content);
            } catch (error) {
                console.error('Error fetching shippers:', error);
            }
        };

        fetchShippers();
    }, []);

    const translateStatus = (status) => {
        switch (status) {
            case 'Available':
                return 'Đang Trống';
            case 'Unavailable':
                return 'Không Trống';
            default:
                return status;
        }
    };

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
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>SỐ ĐIỆN THOẠI</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRẠNG THÁI</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shippers.map((shipper, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{shipper.shipper_id}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{shipper.shipper_full_name}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{shipper.shipper_phone_number}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{translateStatus(shipper.shipper_status)}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                        <Button variant="contained" color="secondary" onClick={() => handleConfirmOpen(shipper.shipper_id, shipper.shipper_full_name)}>
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
            {selectedShipper && (
                <ConfirmShip
                    open={confirmOpen}
                    handleClose={handleConfirmClose}
                    orderId={orderId}
                    shipperId={selectedShipper}
                    shipperName={selectedShipperName}
                    refreshOrders={refreshOrders}
                />
            )}
        </>
    );
};

export default ShipperSelect;
