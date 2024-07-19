import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, MenuItem, Select, InputLabel, FormControl, IconButton, InputAdornment } from '@mui/material';
import { MdOutlineModeEdit } from "react-icons/md";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../../../../App.css';
import { Link } from "react-router-dom";
import logo from '../../../../assets/images/logo.png';
import { RiBillLine } from "react-icons/ri";

const ListBill = ({ user }) => {
    const [open, setOpen] = useState(false);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const users = [
        {
            orderId: '101', customerName: 'Dinh Tin', orderDetails: '1 ComboABC', shipperName: 'Tin Dinh', orderStatus: 'Đã giao thành công', orderDate: '13h20', deliveryDate: '14h10', totalAmount: '2.000.000vnd'
        },
        // Add more users here...
    ];

    return (
        <>
            <div className="actions">
                <Button className="secondary" color="secondary" onClick={handleOpen}>
                    <div className="info pl-0 d-flex align-items-center">
                        <RiBillLine />
                    </div>
                </Button>

            </div>

            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
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
                        CHI TIẾT ĐƠN HÀNG
                    </Typography>
                    <table className="table table-bordered v-align">
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ width: '100px', textAlign: 'center', verticalAlign: 'middle' }}>ID</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TÊN KHÁCH HÀNG</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }} >ĐƠN HÀNG</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRẠNG THÁI</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIỜ NHẬP ĐƠN</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIỜ GIAO TỚI</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TÊN SHIPPER</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIÁ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.orderId}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.customerName}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.orderDetails}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.orderStatus}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.orderDate}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.deliveryDate}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.shipperName}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.totalAmount}</td>
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
        </>
    );
};

export default ListBill;
