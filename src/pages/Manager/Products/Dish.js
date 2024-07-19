import React, { useState, useEffect } from 'react';
import { Snackbar } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import EditDish from './components/crudDish/updateDish';
import DeleteDish from './components/crudDish/deleteDish';
import AddDish from './components/crudDish/addDish';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alert from '@mui/material/Alert';

const DishManager = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [showBy, setshowBy] = useState('');
    const [showBysetCatby, setshowBysetCatby] = useState('');
    const [dishes, setDishes] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        fetchDishes(page);
    }, [page]);

    const fetchDishes = async (pageNumber) => {
        const token = Cookies.get('access_token');
        try {
            const response = await axios.post(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/dish/search?pageNumber=${pageNumber}&pageSize=10&sortField=id&sortDir=asc`,
                // Correct way to pass headers
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data = response.data.data;
            setDishes(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.error('Error fetching dishes:', error);
            setSnackbarMessage('Error fetching dishes');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const refreshData = async () => {
        await fetchDishes(page); // Gọi lại fetchDishes để cập nhật lại danh sách món ăn
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">DANH SÁCH MÓN ĂN</h3>
                    <div className="d-flex justify-content-end "><AddDish refreshDishes={() => fetchDishes(page)} refreshData={refreshData} /></div>
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ID</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TÊN SẢN PHẨM</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIÁ</th>
                                    <th style={{ width: '120px', textAlign: 'center', verticalAlign: 'middle' }}>HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dishes.map((dish, index) => (
                                    <tr key={index}>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{dish.dish_id}</td>
                                        <td>
                                            <div className="d-flex align-items-center productBox">

                                                <div className="info pl-0">
                                                    <h6>{dish.dish_name}</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{dish.dish_price.toLocaleString('vi-VN')} VND</td>
                                        <td>
                                            <div className="actions d-flex align-items-center" style={{ display: 'flex', justifyContent: 'center' }}>
                                                <EditDish dishId={dish.dish_id} refreshDishes={() => fetchDishes(page)} refreshData={refreshData} />
                                                <DeleteDish product={dish} refreshDishes={() => fetchDishes(page)} refreshData={refreshData} />
                                            </div>
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
                </div>
            </div>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <ToastContainer />
        </>
    );
}

export default DishManager;
