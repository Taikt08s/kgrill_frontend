import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Pagination from '@mui/material/Pagination';
import SearchBox from '../../../components/SearchBox';
import ListBillShipper from './components/ListBillShipper';

const ShipperAdmin = () => {
    const [shippers, setShippers] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchShippers = async () => {
        try {
            const token = Cookies.get('access_token');
            const response = await axios.get(
                'https://kgrill-backend-xfzz.onrender.com/api/v1/admin/shipper-tracking',
                {
                    params: {
                        pageNo: page,
                        pageSize: pageSize,
                        sortBy: 'id',
                        sortDir: 'asc',
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = response.data.data;
            setShippers(data.content);
            setPage(data.page_no);
            setPageSize(data.page_size);
            setTotalElements(data.total_elements);
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error('Error fetching shippers:', error);
        }
    };

    useEffect(() => {
        fetchShippers();
    }, [page, pageSize]);

    const handlePageChange = (event, value) => {
        setPage(value - 1);
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="hd">SHIPPER</h3>
                    </div>


                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ID</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>HỌ VÀ TÊN</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TỔNG SỐ ĐƠN</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ĐƠN ĐÃ HOÀN THÀNH</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ĐƠN ĐÃ HỦY</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shippers.map((shipper, index) => (
                                    <tr key={index}>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{shipper.id}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            {shipper.name}
                                        </td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{shipper.total_order}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{shipper.completed_order}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{shipper.cancelled_order}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                            <div className="actions d-flex align-items-center" style={{ display: 'flex', justifyContent: 'center' }}>
                                                <ListBillShipper shipperId={shipper.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex tableFooter">
                            <p>showing <b>{shippers.length}</b> of <b>{totalElements}</b> results</p>
                            <Pagination
                                count={totalPages}
                                page={page + 1}
                                onChange={handlePageChange}
                                color="error"
                                className="pagination"
                                showFirstButton
                                showLastButton
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShipperAdmin;
