import { IoMdSearch } from "react-icons/io";
import React, { useState } from 'react';

const SearchByEmail = ({ onSearch }) => {
    const [email, setEmail] = useState('');

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSearch = () => {
        onSearch(email);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="searchBox position-relative d-flex align-items-center ">
            <IoMdSearch className="mr-2" onClick={handleSearch} />
            <input
                type="text"
                placeholder="Search here ..."
                value={email}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}

export default SearchByEmail;
