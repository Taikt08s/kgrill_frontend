import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import SearchBox from '../../../components/SearchBox';
import DetailBill from './components/detailBill'; // Đảm bảo import chính xác đường dẫn
import Cookies from 'js-cookie';


const Revenue = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('daily'); // Default period is daily

    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const token = Cookies.get('access_token');
                const response = await axios.get(
                    'https://kgrill-backend-xfzz.onrender.com/api/v1/admin/revenue',
                    {
                        params: {
                            pageNo: page,
                            pageSize: pageSize,
                            sortBy: 'id',
                            sortDir: 'asc',
                            period: period,
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const data = response.data.data;
                setRevenueData(data.content);
                setTotalElements(data.total_elements);
                setTotalPages(data.total_pages);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching revenue data:', error);
            }
        };

        fetchRevenueData();
    }, [page, pageSize, period]);

    const handlePageChange = (event, value) => {
        setPage(value - 1);
    };

    const handlePeriodChange = (event) => {
        const selectedPeriod = event.target.value;
        setPeriod(selectedPeriod);
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="hd">THEO DÕI DOANH THU</h3>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <FormControl sx={{ minWidth: 120, ml: 2 }}>
                            <Select
                                value={period}
                                onChange={handlePeriodChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Select period' }}
                                style={{ width: '150px' }}
                            >
                                <MenuItem value="daily">Ngày</MenuItem>
                                <MenuItem value="monthly">Tháng</MenuItem>
                                <MenuItem value="yearly">Năm</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ width: '100px', textAlign: 'center', verticalAlign: 'middle' }}>NGÀY</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TỔNG ĐƠN HÀNG</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ĐƠN HÀNG ĐÃ HOÀN THÀNH</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ĐƠN HÀNG ĐÃ HỦY</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>DOANH THU ĐƠN HOÀN THÀNH</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>THẤT THOÁT ĐƠN HỦY</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TỔNG DOANH THU</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="9" style={{ textAlign: 'center', verticalAlign: 'middle' }}>Loading...</td>
                                    </tr>
                                ) : (
                                    revenueData.map((order, index) => (
                                        <tr key={index}>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.order_date}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.total_order_number}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.completed_number}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.cancelled_number}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.completed_order.toLocaleString('vi-VN')} VND</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.cancelled_order.toLocaleString('vi-VN')} VND</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{order.total_revenue.toLocaleString('vi-VN')} VND</td>
                                            <td>
                                                {(period === 'daily') && (
                                                    <DetailBill date={order.order_date} period={period} />
                                                )}
                                                {(period === 'monthly' || period === 'yearly') && (
                                                    <DetailBill period={period} />
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="d-flex tableFooter">
                            <p>showing <b>{(page * pageSize) + 1}</b> to <b>{(page + 1) * pageSize}</b> of <b>{totalElements}</b> results</p>
                            <Pagination count={totalPages} page={page + 1} color="error" className="pagination" showFirstButton showLastButton onChange={handlePageChange} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Revenue;
