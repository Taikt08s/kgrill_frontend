import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, Snackbar, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import { IoMdAdd } from "react-icons/io";
import axios from 'axios';
import Cookies from 'js-cookie';
import logo from '../../../../../assets/images/logo.png';
import IngredientSelectionModal from './ingredientSelectionModal';

const AddDish = ({ onSave, refreshData }) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        nameDish: '',
        price: '',
        dish_category: { category_id: '', category_name: '' },
        dish_ingredient_list: []
    });
    const [ingredientModalOpen, setIngredientModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [errors, setErrors] = useState({});

    // Mock categories, replace with your actual data fetch if necessary
    const categories = [
        { category_id: 1, value: 'Cooked food', display_name: 'Món chín' },
        { category_id: 2, value: 'Raw food', display_name: 'Món sống' }
    ];

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCategoryChange = (event) => {
        const selectedCategory = categories.find(c => c.category_id === event.target.value);
        setFormData({ ...formData, dish_category: { category_id: selectedCategory.category_id, category_name: selectedCategory.value } });
    };

    const validateFields = () => {
        const newErrors = {};
        if (!formData.nameDish) {
            newErrors.nameDish = 'Tên món ăn không được để trống';
        } else if (formData.nameDish.length > 150) {
            newErrors.nameDish = 'Tên món ăn không được vượt quá 150 ký tự';
        }
        if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0 || Number(formData.price) > 5000000) {
            newErrors.price = 'Giá phải lớn hơn 0 và nhỏ hơn 5,000,000';
        }
        if (!formData.dish_category.category_id) {
            newErrors.dish_category = 'Loại món ăn không được để trống';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateFields()) return;

        try {
            const token = Cookies.get('access_token');
            const response = await axios.post(
                'https://kgrill-backend-xfzz.onrender.com/api/v1/dish/new-dish',

                {
                    dish_name: formData.nameDish,
                    dish_price: parseFloat(formData.price),
                    dish_category: formData.dish_category,
                    dish_ingredient_list: formData.dish_ingredient_list
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setSnackbarMessage('Món ăn đã được thêm thành công!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            if (onSave) {
                onSave(response.data); // Assuming onSave handles updating the dish list
            }
            refreshData();
            handleClose();
        } catch (error) {
            console.error('Error adding dish:', error);
            setSnackbarMessage('Đã xảy ra lỗi khi thêm món ăn');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleIngredientSave = (selectedIngredients) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            dish_ingredient_list: selectedIngredients
        }));
        setIngredientModalOpen(false);
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
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    outline: 'none'
                }}>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={logo} style={{ maxWidth: '120px', maxHeight: '120px', textAlign: 'center', marginTop: '-30px', marginBottom: '-20px' }} alt="logo" />
                    </div>

                    <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Thêm Món Ăn Mới
                    </Typography>

                    <form>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Tên Món Ăn"
                            name="nameDish"
                            value={formData.nameDish}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!errors.nameDish}
                            helperText={errors.nameDish}
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
                        <FormControl fullWidth margin="normal" error={!!errors.dish_category}>
                            <InputLabel id="dish-category-label">Loại món ăn</InputLabel>
                            <Select
                                labelId="dish-category-label"
                                value={formData.dish_category.category_id}
                                label="Loại món ăn"
                                onChange={handleCategoryChange}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.category_id} value={category.category_id}>
                                        {category.display_name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.dish_category && <Typography color="error" variant="body2">{errors.dish_category}</Typography>}
                        </FormControl>
                        <Button
                            variant="contained"
                            onClick={() => setIngredientModalOpen(true)}
                            fullWidth
                            sx={{
                                mt: 2,
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
                            Chọn Nguyên Liệu
                        </Button>
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

            <IngredientSelectionModal
                open={ingredientModalOpen}
                handleClose={() => setIngredientModalOpen(false)}
                handleSave={handleIngredientSave}
            />
        </>
    );
};

export default AddDish;
