import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Pagination from '@mui/material/Pagination';
import SearchByEmail from './Components/searchBox';
import EditUser from './Components/Edit';
import BanUser from './Components/BanUser';

const ManageUser = () => {
    const [searchEmail, setSearchEmail] = useState('');
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [searchEmail, page]);

    const fetchUsers = async () => {
        setLoading(true);
        const pageNo = page - 1; // API expects 0-based page index
        const pageSize = 10;
        const token = Cookies.get('access_token');
        const url = `https://kgrill-backend-xfzz.onrender.com/api/v1/admin/management?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=id&sortDir=asc${searchEmail ? `&email=${encodeURIComponent(searchEmail)}` : ''}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = response.data.data;
            setUsers(data.content || []); // Ensure users is always an array
            setTotalUsers(data.total_elements || 0); // Ensure totalUsers is always a number
            setTotalPages(data.total_pages || 1); // Ensure totalPages is always a number
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]); // Set users to an empty array on error
            setTotalUsers(0); // Set totalUsers to 0 on error
            setTotalPages(1); // Set totalPages to 1 on error
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const refreshUser = (updatedUser) => {
        setUsers(users.map(user => user.user_id === updatedUser.user_id ? updatedUser : user));
    };

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="hd">All Users</h3>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <SearchByEmail onSearch={setSearchEmail} />
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>STT</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>HỌ VÀ TÊN</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>EMAIL</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>ĐỊA CHỈ</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>CHỨC VỤ</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>TRẠNG THÁI</th>
                                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center' }}>Loading...</td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr key={user.user_id}>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{(page - 1) * 10 + index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center productBox">
                                                    <div className="info pl-0">
                                                        <h6>{user.first_name} {user.last_name}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.email}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.address}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.role}</td>
                                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{user.account_not_locked ? 'Active' : 'Locked'}</td>
                                            <td>
                                                <div className="actions d-flex align-items-center" style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <BanUser userId={user.user_id} user={user} refreshUser={refreshUser} />
                                                    <EditUser user={user} refreshUser={refreshUser} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="d-flex tableFooter">
                            <p>Showing <b>{users.length}</b> of <b>{totalUsers}</b> results</p>
                            <Pagination count={totalPages} page={page} color="error" className="pagination" showFirstButton showLastButton onChange={handlePageChange} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManageUser;
