import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import { IoMdAdd } from "react-icons/io";
import getCroppedImg from './cropImage';
import Cropper from 'react-easy-crop';
import logo from '../../../../../assets/images/logo.png';
import axios from 'axios';
import Cookies from 'js-cookie';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DishSelectionModal from './DishSelectionModal';

const AddCombo = ({ refreshData }) => {
    const [open, setOpen] = useState(false);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        package_name: '',
        package_description: '',
        package_price: '',
        package_type: '',
        package_size: '',
        package_active_status: false,
        package_dish_list: [],
        package_thumbnail_url: '',
        package_id: null
    });
    const [dishModalOpen, setDishModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const newErrors = {};
        if (!formData.package_name) {
            newErrors.package_name = 'Tên Combo không được để trống';
        } else if (formData.package_name.length > 150) {
            newErrors.package_name = 'Tên Combo không được vượt quá 150 ký tự';
        }
        if (!formData.package_price || isNaN(formData.package_price) || Number(formData.package_price) <= 0 || Number(formData.package_price) > 5000000) {
            newErrors.package_price = 'Giá phải lớn hơn 0 và nhỏ hơn 5,000,000';
        }
        if (!formData.package_size) newErrors.package_size = 'Size không được để trống';
        if (!formData.package_type) newErrors.package_type = 'Loại không được để trống';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDescriptionChange = (value) => {
        setFormData({ ...formData, package_description: value });
    };

    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const handleCropModalOpen = () => setCropModalOpen(true);
    const handleCropModalClose = () => setCropModalOpen(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
                setSelectedImage(file);
                handleCropModalOpen();
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    const uploadThumbnail = async (file, packageId) => {
        const token = Cookies.get('access_token');
        const formData = new FormData();
        formData.append('thumbnail_pic', file);

        try {
            const response = await axios.post(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/food-package/package-thumbnail?packageId=${packageId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            console.log('Upload Thumbnail Response:', response.data);
            if (response.data.data && response.data.data.thumbnail_url) {
                return response.data.data.thumbnail_url;
            } else {
                throw new Error('No thumbnail URL returned');
            }
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            throw new Error('Error uploading thumbnail');
        }
    };

    const handleSave = async () => {
        if (!validateFields()) return;

        try {
            const token = Cookies.get('access_token');
            const descriptionClean = stripHtml(formData.package_description);
            const initialFormData = {
                package_name: formData.package_name,
                package_description: descriptionClean,
                package_price: formData.package_price,
                package_type: formData.package_type,
                package_size: formData.package_size,
                package_active_status: formData.package_active_status,
                package_dish_list: formData.package_dish_list.map(dish => ({
                    dish_id: dish.dish_id,
                    dish_name: dish.dish_name,
                    dish_quantity: dish.quantity || dish.dish_quantity,
                }))
            };

            // Create new combo package without thumbnail URL
            const addResponse = await axios.post(
                'https://kgrill-backend-xfzz.onrender.com/api/v1/food-package/new-package',
                initialFormData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const newComboId = addResponse.data.data;
            console.log('New Combo ID:', newComboId);
            setFormData({ ...formData, package_id: newComboId }); // Cập nhật package_id

            // Upload thumbnail if there's a cropped image
            let thumbnailUrl = '';
            if (croppedArea && imageSrc) {
                const croppedImageBlob = await getCroppedImg(imageSrc, croppedArea);
                console.log('Cropped Image Blob:', croppedImageBlob);
                thumbnailUrl = await uploadThumbnail(croppedImageBlob, newComboId);
            } else if (selectedImage) {
                thumbnailUrl = await uploadThumbnail(selectedImage, newComboId);
            }

            // Update combo package with thumbnail URL
            const updatedFormData = {
                ...initialFormData,
                package_id: newComboId,
                package_thumbnail_url: thumbnailUrl
            };

            await axios.put(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/food-package/${newComboId}`,
                updatedFormData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            handleClose(); // Close the modal after successful save
            refreshData(); // Refresh data after adding new combo
            setSnackbarMessage('Thêm Combo thành công');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage('Thêm Combo thành công');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            refreshData();
            handleClose();
        }
    };

    const handleDishSave = (selectedDishes) => {
        setFormData(prev => ({ ...prev, package_dish_list: selectedDishes }));
    };

    const handleCropConfirm = async () => {
        if (croppedArea && imageSrc) {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedArea);
            setSelectedImage(croppedImageBlob); // Lưu ảnh đã cắt vào selectedImage để upload
            handleCropModalClose();
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
            <Button variant="contained" color="error" onClick={handleOpen} className="custom-button">
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '25px', height: '25px' }}>
                    <IoMdAdd />
                </span>
                Thêm
            </Button>

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
                        Thêm Combo Mới
                    </Typography>

                    <form>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Tên Combo"
                            name="package_name"
                            value={formData.package_name}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!errors.package_name}
                            helperText={errors.package_name}
                        />
                        <Box mt={2}>
                            <TextField
                                type="file"
                                label="Hình Ảnh"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ accept: "image/*" }}
                                onChange={handleFileChange}
                            />
                        </Box>
                        <FormControl fullWidth margin="normal" variant="outlined">
                            <InputLabel>Loại</InputLabel>
                            <Select
                                name="package_type"
                                value={formData.package_type}
                                onChange={handleChange}
                                label="Loại"
                                error={!!errors.package_type}
                            >
                                <MenuItem value="lẩu">Lẩu</MenuItem>
                                <MenuItem value="nướng">Nướng</MenuItem>
                                <MenuItem value="nướng + lẩu">Nướng và Lẩu</MenuItem>
                                <MenuItem value="cơm">Cơm</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Giá"
                            name="package_price"
                            value={formData.package_price}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!errors.package_price}
                            helperText={errors.package_price}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="active-status-label">Trạng Thái</InputLabel>
                            <Select
                                labelId="active-status-label"
                                name="package_active_status"
                                value={formData.package_active_status}
                                label="Trạng Thái"
                                onChange={handleChange}
                            >
                                <MenuItem value={true}>Còn Hàng</MenuItem>
                                <MenuItem value={false}>Hết Hàng</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant="subtitle1" gutterBottom>
                            Mô Tả Sản Phẩm
                        </Typography>
                        <ReactQuill
                            theme="snow"
                            value={formData.package_description}
                            onChange={handleDescriptionChange}
                            style={{ height: '200px', marginBottom: '50px' }}
                        />
                        {errors.package_description && <Typography color="error" variant="body2">{errors.package_description}</Typography>}
                        <div style={{ paddingTop: '10px' }}>
                            <FormControl fullWidth margin="normal" variant="outlined">
                                <InputLabel>Size</InputLabel>
                                <Select
                                    name="package_size"
                                    value={formData.package_size}
                                    onChange={handleChange}
                                    label="Size"
                                    error={!!errors.package_size}
                                >
                                    <MenuItem value="1-2 người">Combo 1-2 người</MenuItem>
                                    <MenuItem value="2-3 người">Combo 2-3 người</MenuItem>
                                    <MenuItem value="3-5 người">Combo 3-5 người</MenuItem>
                                    <MenuItem value="5-7 người">Combo 5-7 người</MenuItem>
                                </Select>
                                {errors.package_size && <Typography color="error" variant="body2">{errors.package_size}</Typography>}
                            </FormControl>
                        </div>
                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setDishModalOpen(true);
                                }}
                                sx={{
                                    width: '100%',
                                    height: 56,
                                    padding: '10px 14px',
                                    borderRadius: 1,
                                    border: '1px solid #ccc',
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    '&:hover': {
                                        backgroundColor: '#f7f7f7',
                                    },
                                }}
                            >
                                Chọn món ăn
                            </Button>
                        </Box>
                    </form>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button variant="contained" color="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button variant="contained" sx={{ backgroundColor: '#f45050', '&:hover': { backgroundColor: '#d43d3d' }, ml: 2 }} onClick={handleSave}>
                            Thêm
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <DishSelectionModal
                open={dishModalOpen}
                handleClose={() => setDishModalOpen(false)}
                handleSave={handleDishSave}
                selectedDishes={formData.package_dish_list}
            />
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

export default AddCombo;
