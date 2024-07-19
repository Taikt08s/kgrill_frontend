import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { RiBillLine } from "react-icons/ri";
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../../../App.css';
import logo from '../../../../assets/images/logo.png';

const DetailProduct = ({ packageId }) => {
    const [open, setOpen] = useState(false);
    const [productDetails, setProductDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => {
        fetchProductDetails();
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const fetchProductDetails = async () => {
        setLoading(true);
        const token = Cookies.get('access_token');
        const url = `https://kgrill-backend-xfzz.onrender.com/api/v1/food-package/update-package?pkgId=${packageId}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setProductDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching product details:', error);
            setProductDetails(null);
        } finally {
            setLoading(false);
        }
    };

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
                    {loading ? (
                        <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                            Loading...
                        </Typography>
                    ) : (
                        productDetails && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src={logo} style={{ maxWidth: '120px', maxHeight: '120px', textAlign: 'center', marginTop: '-30px', marginBottom: '-20px' }} />
                                </div>
                                <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    CHI TIẾT SẢN PHẨM
                                </Typography>
                                <table className="table table-bordered v-align">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ID</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TÊN SẢN PHẨM</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>MÔ TẢ</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIÁ</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>LOẠI</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>SIZE</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRẠNG THÁI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{productDetails.package_id}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{productDetails.package_name}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{productDetails.package_description}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{productDetails.package_price.toLocaleString('vi-VN')} VND</td>

                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{productDetails.package_type}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{productDetails.package_size}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{productDetails.package_active_status ? 'Còn Hàng' : 'Hết Hàng'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Box mt={2} display="flex" justifyContent="flex-end">
                                    <Button variant="contained" color="secondary" onClick={handleClose}>
                                        Đóng
                                    </Button>
                                </Box>
                            </>
                        )
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default DetailProduct;
