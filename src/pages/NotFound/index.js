// NotFound.js
import NotFound404 from '../../assets/images/404-not-found.png'
import React from 'react';

const NotFound = () => {
    return (
        <div>
            <div className="text-center w-100">
                <img src={NotFound404} alt="404-not-found"
                    width={"80%"} />
                <h2 className='font-weight-bold'>
                    Bạn hiện không xem được nội dung này
                </h2>
            </div>
        </div>
    );
};

export default NotFound;
