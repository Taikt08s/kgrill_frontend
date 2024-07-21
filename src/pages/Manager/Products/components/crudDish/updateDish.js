import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Typography, Snackbar, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { MdOutlineModeEdit } from 'react-icons/md';
import axios from 'axios';
import logo from '../../../../../assets/images/logo.png';
import Cookies from 'js-cookie';
import IngredientSelectionModal from './ingredientSelectionModal';

const EditDish = ({ dishId, refreshData }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        nameProduct: '',
        price: '',
        dish_ingredient_list: [],
        dish_category: { category_id: '', category_name: '' }
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [ingredientModalOpen, setIngredientModalOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const categories = [
        { category_id: 1, value: 'Main course', display_name: 'Món chính' },
        { category_id: 2, value: 'Side dishes', display_name: 'Món phụ' }
    ];

    const fetchDishDetails = async (id) => {
        const token = Cookies.get('access_token');
        try {
            const response = await axios.get(`https://kgrill-backend-xfzz.onrender.com/api/v1/dish/dish-detail?id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            const product = response.data;
            setFormData({
                id: product.dish_id || '',
                nameProduct: product.dish_name || '',
                price: product.dish_price ? product.dish_price.toString() : '',
                dish_ingredient_list: product.dish_ingredient_list || [],
                dish_category: product.dish_category ? { category_id: product.dish_category.category_id, category_name: product.dish_category.category_name } : { category_id: '', category_name: '' }
            });
        } catch (error) {
            console.error('Error fetching dish details:', error);
            setSnackbarMessage('Error fetching dish details');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleOpen = () => {
        fetchDishDetails(dishId);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCategoryChange = (event) => {
        const selectedCategory = categories.find(c => c.category_id === event.target.value);
        setFormData({ ...formData, dish_category: { category_id: selectedCategory.category_id, category_name: selectedCategory.value } });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const validateFields = () => {
        const newErrors = {};
        if (!formData.nameProduct) newErrors.nameProduct = 'Tên sản phẩm không được để trống';
        if (formData.nameProduct.length > 150) newErrors.nameProduct = 'Tên sản phẩm không được vượt quá 150 ký tự';
        if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0 || Number(formData.price) > 5000000) newErrors.price = 'Giá phải lớn hơn 0 và nhỏ hơn 5,000,000';
        if (!formData.dish_category.category_id) newErrors.dish_category = 'Loại món ăn không được để trống';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateFields()) return;

        try {
            const token = Cookies.get('access_token');

            const updatedDish = {
                dish_id: formData.id,
                dish_name: formData.nameProduct,
                dish_price: parseFloat(formData.price),
                dish_category: formData.dish_category,
                dish_ingredient_list: formData.dish_ingredient_list
            };

            const response = await axios.put(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/dish/`,
                updatedDish,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            refreshData();
            setSnackbarMessage('Cập nhật thành công');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleClose();
        } catch (error) {
            console.error('Error updating product:', error);
            setSnackbarMessage('Cập nhật thất bại');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            handleClose();
        }
    };

    const handleSaveIngredients = (selectedIngredients) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            dish_ingredient_list: selectedIngredients
        }));
    };

    if (!dishId) {
        return null;
    }

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
                        <img src={logo} style={{ maxWidth: '120px', maxHeight: '120px', textAlign: 'center', marginTop: '-30px', marginBottom: '-20px' }} alt="Logo" />
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
                            error={!!errors.nameProduct}
                            helperText={errors.nameProduct}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Giá"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!errors.price}
                            helperText={errors.price}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="dish-category-label">Loại món ăn</InputLabel>
                            <Select
                                labelId="dish-category-label"
                                value={formData.dish_category.category_id}
                                label="Loại món ăn"
                                onChange={handleCategoryChange}
                                error={!!errors.dish_category}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.category_id} value={category.category_id}>
                                        {category.display_name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.dish_category && <Typography color="error" variant="body2">{errors.dish_category}</Typography>}
                        </FormControl>
                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setIngredientModalOpen(true);
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
                                Chọn nguyên liệu
                            </Button>
                        </Box>
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

            <IngredientSelectionModal
                open={ingredientModalOpen}
                handleClose={() => setIngredientModalOpen(false)}
                handleSave={handleSaveIngredients}
                initialSelectedIngredients={formData.dish_ingredient_list}
            />
        </>
    );
};

export default EditDish;
