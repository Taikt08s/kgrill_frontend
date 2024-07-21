import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { IoMdSearch } from 'react-icons/io';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Cookies from 'js-cookie';

const IngredientSelectionModal = ({ open, handleClose, handleSave, initialSelectedIngredients = [] }) => {
    const [ingredients, setIngredients] = useState([]);
    const [selected, setSelected] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchIngredients = async (pageNumber = 1, searchTerm = '', retries = 3) => {
        setLoading(true);
        const token = Cookies.get('access_token');
        try {
            const response = await axios.post(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/ingredient/ingredient-list?pageNumber=${pageNumber}&pageSize=10&sortField=id&sortDir=asc&value=${searchTerm}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data = response.data.data.content;
            setIngredients(data);

            // Tạo một object mới với trạng thái selected của các ingredients
            const initialSelected = {};
            data.forEach(ingredient => {
                initialSelected[ingredient.ingredient_id] = initialSelectedIngredients.some(item => item.ingredient_id === ingredient.ingredient_id);
            });
            setSelected(initialSelected);
            setTotalElements(response.data.data.totalElements);
            setTotalPages(response.data.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            if (retries > 0) {
                console.log(`Retrying... ${retries} attempts left`);
                fetchIngredients(pageNumber, searchTerm, retries - 1);
            } else {
                setLoading(false);
                setError('Failed to fetch ingredients after multiple attempts.');
            }
        }
    };

    useEffect(() => {
        if (open) {
            fetchIngredients(page, searchTerm);
        }
    }, [open, page, searchTerm]);

    const handleIngredientToggle = (ingredientId) => {
        setSelected(prevSelected => ({
            ...prevSelected,
            [ingredientId]: !prevSelected[ingredientId]
        }));
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearchKeyPress = (event) => {
        if (event.key === 'Enter') {
            setSearchTerm(event.target.value);
        }
    };

    const handleSaveSelection = () => {
        const selectedIngredientsList = ingredients.filter(ingredient => selected[ingredient.ingredient_id]).map(ingredient => ({
            ingredient_id: ingredient.ingredient_id,
            ingredient_name: ingredient.ingredient_name
        }));
        handleSave(selectedIngredientsList);
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
                    Chọn nguyên liệu
                </Typography>
                <div className="card shadow border-0 p-3 mt-4">
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <div className="table-responsive mt-3">
                            <table className="table table-bordered v-align">
                                <thead className="thead-dark">
                                    <tr>
                                        <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ID</th>
                                        <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TÊN NGUYÊN LIỆU</th>
                                        <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CHỌN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ingredients.map((ingredient) => (
                                        <tr key={ingredient.ingredient_id}>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{ingredient.ingredient_id}</td>
                                            <td>{ingredient.ingredient_name}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                <FormControlLabel
                                                    control={<Checkbox checked={selected[ingredient.ingredient_id]} onChange={() => handleIngredientToggle(ingredient.ingredient_id)} />}
                                                    label=""
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-between align-items-center">
                                <p>Showing <b>{ingredients.length}</b> of <b>{totalElements}</b> results</p>
                                <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
                            </div>
                        </div>
                    )}
                </div>
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: '#f45050', '&:hover': { backgroundColor: '#d43d3d' }, ml: 2 }} onClick={handleSaveSelection}>
                        Lưu
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default IngredientSelectionModal;
