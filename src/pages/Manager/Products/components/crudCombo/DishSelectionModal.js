import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Modal, Typography, MenuItem, Select, InputLabel, FormControl, IconButton, InputBase, TextField } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';

const DishSelectionModal = ({ open, handleClose, handleSave, selectedDishes }) => {
    const [dishes, setDishes] = useState([]);
    const [selected, setSelected] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [minPrice, setMinPrice] = useState('0');
    const [maxPrice, setMaxPrice] = useState('100000000');
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const initializeSelected = (dishes, selectedDishes) => {
        const initialSelected = {};
        dishes.forEach(dish => {
            const selectedDish = selectedDishes.find(item => item.dish_id === dish.dish_id);
            initialSelected[dish.dish_id] = selectedDish ? { ...dish, quantity: selectedDish.dish_quantity } : { ...dish, quantity: 0 };
        });
        return initialSelected;
    };

    const fetchDishes = async (pageNumber = 1, searchTerm = '', selectedType = '', minPrice = '0', maxPrice = '100000000', retries = 3) => {
        setLoading(true);
        const token = Cookies.get('access_token');

        const queryParams = new URLSearchParams({
            pageNumber,
            pageSize: 10,
            sortField: 'id',
            sortDir: 'asc',
            ...(searchTerm && { keyword: searchTerm }),
            ...(selectedType && { category: selectedType }),
            minPrice,
            maxPrice
        }).toString();

        try {
            const response = await axios.get(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/dish/dish-details-by-filter?${queryParams}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('API Response:', response.data);

            if (response.data && response.data.content) {
                const data = response.data.content;
                setDishes(data);
                setSelected(initializeSelected(data, selectedDishes));
                setTotalElements(response.data.totalElements);
                setTotalPages(response.data.totalPages);
                setError(null); // Clear any previous errors
            } else {
                throw new Error('Unexpected API response structure');
            }
        } catch (error) {
            console.error('Error fetching dishes:', error);
            setError(`Error: ${error.message}`);
            if (retries > 0) {
                console.log(`Retrying... ${retries} attempts left`);
                setTimeout(() => {
                    fetchDishes(pageNumber, searchTerm, selectedType, minPrice, maxPrice, retries - 1);
                }, 1000);
            } else {
                setError('Failed to fetch dishes after multiple attempts.');
            }
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(debounce((term) => {
        setSearchTerm(term);
    }, 500), []);

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
        debouncedSearch(event.target.value);
    };

    useEffect(() => {
        if (open) {
            fetchDishes(page, searchTerm, selectedType, minPrice, maxPrice);
        }
    }, [open, page, searchTerm, selectedType, minPrice, maxPrice]);

    useEffect(() => {
        if (dishes.length > 0) {
            setSelected(initializeSelected(dishes, selectedDishes));
        }
    }, [selectedDishes, dishes]);

    const handleQuantityChange = (dishId, newQuantity) => {
        setSelected(prevSelected => ({
            ...prevSelected,
            [dishId]: {
                ...prevSelected[dishId],
                quantity: newQuantity
            }
        }));
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSaveSelection = () => {
        const selectedDishesList = Object.values(selected).filter(dish => dish.quantity > 0);
        handleSave(selectedDishesList);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxHeight: '90vh',
                overflowY: 'auto',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                outline: 'none'
            }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
                    Chọn món ăn
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <div className="searchBox position-relative d-flex align-items-center">
                        <IoMdSearch className="mr-2" />
                        <InputBase
                            placeholder="Tìm kiếm..."
                            onChange={handleSearchChange}
                            value={searchValue}
                        />
                    </div>
                </Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="type-label">Loại thức ăn</InputLabel>
                    <Select
                        labelId="type-label"
                        label="Loại thức ăn"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        variant="outlined"
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="Raw food">Món sống</MenuItem>
                        <MenuItem value="Cooked food">Món chín</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                    <TextField
                        label="Giá tối thiểu"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                    />
                    <TextField
                        label="Giá tối đa"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                    />
                </Box>
                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">DANH SÁCH SẢN PHẨM</h3>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <>
                            <div className="table-responsive mt-3">
                                <table className="table table-bordered v-align">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ID</th>
                                            <th style={{ width: '100px', textAlign: 'center', verticalAlign: 'middle' }}>TÊN SẢN PHẨM</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIÁ</th>
                                            <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>HÀNH ĐỘNG</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dishes.map((dish) => (
                                            <tr key={dish.dish_id}>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{dish.dish_id}</td>
                                                <td>
                                                    <div className="d-flex align-items-center productBox">
                                                        <div className="info pl-0">
                                                            <h6>{dish.name}</h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{dish.price.toLocaleString('vi-VN')} VND</td>
                                                <td>
                                                    <Box className="actions d-flex align-items-center" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <IconButton onClick={() => handleQuantityChange(dish.dish_id, selected[dish.dish_id].quantity - 1)} disabled={selected[dish.dish_id].quantity <= 0}>
                                                            <Typography>-</Typography>
                                                        </IconButton>
                                                        <InputBase
                                                            type="number"
                                                            value={selected[dish.dish_id].quantity}
                                                            readOnly
                                                            sx={{
                                                                width: '50px',
                                                                textAlign: 'center',
                                                                mx: 1,
                                                                '& input': { textAlign: 'center' }
                                                            }}
                                                        />
                                                        <IconButton onClick={() => handleQuantityChange(dish.dish_id, selected[dish.dish_id].quantity + 1)}>
                                                            <Typography>+</Typography>
                                                        </IconButton>
                                                    </Box>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="d-flex tableFooter">
                                    <p>showing <b>{dishes.length}</b> of <b>{totalElements}</b> results</p>
                                    <Pagination count={totalPages} page={page} color="error" className="pagination" showFirstButton showLastButton onChange={handlePageChange} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="secondary" onClick={handleClose} sx={{ width: '100px' }}>
                        Hủy
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: '#f45050', '&:hover': { backgroundColor: '#d43d3d' }, ml: 2, width: '100px' }} onClick={handleSaveSelection}>
                        Lưu
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DishSelectionModal;
