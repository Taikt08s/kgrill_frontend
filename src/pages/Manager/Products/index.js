import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from '@mui/material';
import AddCombo from './components/crudCombo/addCombo';
import EditCombo from './components/crudCombo/updateCombo';
import DeleteCombo from './components/crudCombo/deleteCombo';
import Cookies from 'js-cookie';
import DetailProduct from '../../Admin/Products/components/detailProduct';

const ProductsManager = () => {
    const [packages, setPackages] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        fetchPackages(page);
    }, [page]);

    const fetchPackages = async (pageNumber) => {
        const token = Cookies.get('access_token');
        try {
            const response = await axios.post(
                `https://kgrill-backend-xfzz.onrender.com/api/v1/food-package/package-list?pageNumber=${pageNumber}&pageSize=10&sortField=id&sortDir=asc`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data = response.data.data.content;
            setPackages(data);
            setTotalPages(response.data.data.totalPages);
            setTotalElements(response.data.data.totalElements);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const refreshData = () => {
        fetchPackages(page);
    };

    return (
        <div className="right-content w-100">
            <div className="card shadow border-0 p-3 mt-4">
                <h3 className="hd">DANH SÁCH SẢN PHẨM</h3>
                <div className="d-flex justify-content-end">
                    <AddCombo refreshData={refreshData} />
                </div>
                <div className="table-responsive mt-3">
                    <table className="table table-bordered v-align">
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ID</th>
                                <th style={{ width: '100px', textAlign: 'center', verticalAlign: 'middle' }}>TÊN SẢN PHẨM</th>
                                <th style={{ width: '300px', textAlign: 'center', verticalAlign: 'middle' }}>MÔ TẢ</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>GIÁ</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRẠNG THÁI</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map((pkg) => (
                                <tr key={pkg.package_id}>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{pkg.package_id}</td>
                                    <td>
                                        <div className="d-flex align-items-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img">
                                                    <img src={pkg.package_thumbnail_url || "https://via.placeholder.com/100"} className="w-100" />
                                                </div>
                                            </div>
                                            <div className="info pl-0">
                                                <h6>{pkg.package_name}</h6>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{pkg.package_description || "N/A"}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{pkg.package_price.toLocaleString('vi-VN')} VND</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{pkg.package_active_status ? "Còn Hàng" : "Hết Hàng"}</td>
                                    <td>
                                        <div className="actions d-flex align-items-center" style={{ display: 'flex', justifyContent: 'center' }}>
                                            <DetailProduct packageId={pkg.package_id} />
                                            <EditCombo productId={pkg.package_id} refreshData={refreshData} />
                                            <DeleteCombo productId={pkg.package_id} refreshData={refreshData} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex tableFooter">
                        <p>showing <b>{packages.length}</b> of <b>{totalElements}</b> results</p>
                        <Pagination count={totalPages} page={page} color="error" className="pagination" showFirstButton showLastButton onChange={handlePageChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsManager;
