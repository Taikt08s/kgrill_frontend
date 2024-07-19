import React, { useContext, useState, useEffect } from 'react';
import Logo from '../../assets/images/kgrill-logo-dark.png';
import { MyContext } from '../../App';
import patern from '../../assets/images/pattern.jpg';
import { IoIosMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import { login } from "../../api/axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Login = () => {
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const context = useContext(MyContext);
    const navigate = useNavigate();

    useEffect(() => {
        context.setisHideSidebarAndHeader(true);
    }, [context]);

    const focusInput = (index) => {
        setInputIndex(index);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            setEmailError('Lỗi cấu trúc xxx@xxx.xxx');
            return;
        }

        setIsLoading(true);

        try {
            const decodedPayload = await login({ email, password });
            const role = decodedPayload.role;
            if (role === 'ADMIN') {
                navigate('/dashboard');
            } else if (role === 'MANAGER') {
                navigate('/dashboard');
            } else {
                navigate('/dashboard');
            }

            context.setIsLogin(true);
            context.setisHideSidebarAndHeader(false);
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('Tài khoản này không được phép đăng nhập vào hệ thống');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <img src={patern} className='loginPatern' alt="pattern" />
            <section className="loginSection">
                <div className="loginBox">
                    <div className="logo text-center">
                        <img src={Logo} width="100px" alt="KGrill Logo" />
                        <h5 className='font-weight-bold'>Đăng Nhập Vào KGrill</h5>
                    </div>

                    <div className='wrapper mt-3 card border'>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className={`form-group mb-3 position-relative ${inputIndex === 0 ? 'focus' : ''} ${emailError ? 'has-error' : ''}`}>
                                <span className='icon'><IoIosMail /></span>
                                <input
                                    type="text"
                                    className={`form-control ${emailError ? 'is-invalid' : ''}`}
                                    placeholder='Enter your email'
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                        if (emailError) setEmailError('');
                                    }}
                                    onFocus={() => focusInput(0)}
                                    onBlur={() => setInputIndex(null)}
                                    required
                                />
                                {emailError && <div className="invalid-feedback">{emailError}</div>}
                            </div>

                            <div className={`form-group mb-3 position-relative ${inputIndex === 1 ? 'focus' : ''}`}>
                                <span className='icon'><RiLockPasswordFill /></span>
                                <input
                                    type={isShowPassword ? 'text' : 'password'}
                                    className='form-control'
                                    placeholder='Enter your password'
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    onFocus={() => focusInput(1)}
                                    onBlur={() => setInputIndex(null)}
                                    required
                                />
                                <span className='toggleShowPassword' onClick={() => setIsShowPassword(!isShowPassword)}>
                                    {isShowPassword ? <IoIosEye /> : <IoIosEyeOff />}
                                </span>
                            </div>

                            <div className='form-group'>
                                <Button className="btn-blue btn-lg w-100 btn-big" type="submit">
                                    {isLoading ? <CircularProgress color="inherit" style={{ width: 28, height: 28 }} /> : 'Đăng Nhập'}
                                </Button>
                            </div>
                            <ToastContainer position="top-right" autoClose="3000" />
                        </form>
                    </div>

                </div>
            </section>
        </>
    );
};

export default Login;
