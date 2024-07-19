import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { MdOutlineModeEdit } from "react-icons/md";
import axios from 'axios';
import '../../../../App.css';
import logo from '../../../../assets/images/logo.png';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage'; // Utility function to crop image


const EditProduct = ({ product }) => {
    const [open, setOpen] = useState(false);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: product.id,
        nameProduct: product.nameProduct,
        describe: product.describe,
        price: product.price,
        status: product.status,
        image: product.image
    });

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleCropModalOpen = () => setCropModalOpen(true);
    const handleCropModalClose = () => setCropModalOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                handleCropModalOpen();
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    const handleSave = async () => {
        try {
            let updatedFormData = { ...formData };

            if (croppedArea && imageSrc) {
                const croppedImage = await getCroppedImg(imageSrc, croppedArea);
                updatedFormData = { ...updatedFormData, image: croppedImage };
            }

            const response = await axios.put(`/api/products/${formData.id}`, updatedFormData);
            console.log('Product updated:', response.data);
        } catch (error) {
            console.error('Error updating product:', error);
        } finally {
            handleClose();
        }
    };

    const handleCropConfirm = async () => {
        if (croppedArea && imageSrc) {
            const croppedImage = await getCroppedImg(imageSrc, croppedArea);
            setFormData({ ...formData, image: croppedImage });
            setImageSrc(null);
            handleCropModalClose();
        }
    };

    return (
        <>
            <Button className="success" color="success" onClick={handleOpen}><MdOutlineModeEdit /></Button>

            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    maxHeight: '90vh',
                    overflowY: 'auto',
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
                        Chỉnh sửa thông tin
                    </Typography>

                    <form>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="ID"
                            name="id"
                            value={formData.id}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Tên Sản Phẩm"
                            name="nameProduct"
                            value={formData.nameProduct}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <Box mt={2}>
                            <TextField
                                type="file"
                                label="Hình Sản Phẩm"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ accept: "image/*" }}
                                onChange={handleFileChange}
                            />
                        </Box>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Mô Tả"
                            name="describe"
                            value={formData.describe}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Giá"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <FormControl fullWidth margin="normal" variant="outlined">
                            <InputLabel>Trạng Thái</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                label="Trạng Thái"
                            >
                                <MenuItem value="Còn Hàng">Còn Hàng</MenuItem>
                                <MenuItem value="Hết Hàng">Hết Hàng</MenuItem>
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

            <Modal open={cropModalOpen} onClose={handleCropModalClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    outline: 'none'
                }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Cắt hình ảnh
                    </Typography>

                    <Box mt={2} sx={{ position: 'relative', width: '100%', height: 200, backgroundColor: '#333' }}>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </Box>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleCropModalClose}>
                            Hủy
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: '#f45050', '&:hover': { backgroundColor: '#d43d3d' }, ml: 2 }} onClick={handleCropConfirm}>
                            Đồng ý
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default EditProduct;