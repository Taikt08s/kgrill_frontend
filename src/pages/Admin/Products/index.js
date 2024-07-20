import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Pagination from '@mui/material/Pagination';
import DetailProduct from './components/detailProduct';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const fetchProducts = async () => {
        setLoading(true);
        const pageSize = 10;
        const token = Cookies.get('access_token');
        const url = `https://kgrill-backend-xfzz.onrender.com/api/v1/food-package/package-list?pageNumber=${page}&pageSize=${pageSize}&sortField=id&sortDir=asc`;

        try {
            const response = await axios.post(
                url,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data = response.data.data;
            setProducts(data.content || []);
            setTotalProducts(data.totalElements || 0);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setTotalProducts(0);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">DANH SÁCH SẢN PHẨM</h3>
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
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td>
                                    </tr>
                                ) : (
                                    products.map((product, index) => (
                                        <tr key={product.package_id}>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{product.package_id}</td>
                                            <td>
                                                <div className="d-flex align-items-center productBox">
                                                    <div className="imgWrapper">
                                                        <div className="img">
                                                            <img src={product.package_thumbnail_url} className="w-100" alt={product.package_name} />
                                                        </div>
                                                    </div>
                                                    <div className="info pl-0">
                                                        <h6>{product.package_name}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{product.package_description}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{product.package_price.toLocaleString('vi-VN')} VND</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{product.package_active_status ? 'Còn Hàng' : 'Hết Hàng'}</td>
                                            <td>
                                                <div className="actions d-flex align-items-center" style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <DetailProduct packageId={product.package_id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="d-flex tableFooter">
                            <p>showing <b>{products.length}</b> of <b>{totalProducts}</b> results</p>
                            <Pagination count={Math.ceil(totalProducts / 10)} page={page} color="error" className="pagination" showFirstButton showLastButton onChange={handlePageChange} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Products;
