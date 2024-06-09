import DashboardBox from "./components/dashboardBox";
import { FaCircleUser } from "react-icons/fa6";
import { TiShoppingCart } from "react-icons/ti";
import { RiShoppingBasket2Line } from "react-icons/ri";
import { TbStars } from "react-icons/tb";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from "react";
import { RxTimer } from "react-icons/rx";
import Button from '@mui/material/Button';
import { BsThreeDotsVertical } from "react-icons/bs";
import { Chart } from "react-google-charts";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from "react";
import { FaEye } from "react-icons/fa6";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import Pagination from '@mui/material/Pagination';


export const data = [
    ["Year", "Sales", "Expenses"],
    ["2004", 1000, 400],
    ["2005", 1170, 460],
    ["2006", 660, 1120],
    ["2007", 1030, 540],
];

export const options = {
    'backgroundColor': 'transparent',
    'chartArea': { 'width': '100%', 'height': '100%' }
};

const Dashboard = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [showBy, setshowBy] = useState('');
    const [showBysetCatby, setshowBysetCatby] = useState('');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const ITEM_HEIGHT = 48;

    return (
        <>
            <div className="right-content w-100">
                <div className="row dashboardBoxWrapperRow">
                    <div className="col-md-8">
                        <div className="dashboardBoxWrapper d-flex">
                            <DashboardBox color={["#1da256", "#48d483"]} icon={<FaCircleUser />}
                                grow={true} />
                            <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<TiShoppingCart />} />
                            <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<RiShoppingBasket2Line />} />
                            <DashboardBox color={["#e1950e", "#f3cd29"]} icon={<TbStars />} />
                        </div>
                    </div>

                    <div className="col-md-4 pl-0">
                        <div className="box graphBox">
                            <div className="d-flex align-items-center w-100 bottomEle">
                                <h6 className="text-white mb-0 mt-0">Total Sales</h6>
                                <div className="ml-auto">
                                    <Button className="ml-auto toggleIcon" onClick={handleClick}><BsThreeDotsVertical /></Button>
                                    <Menu
                                        className="dropdown_menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'long-button',
                                        }}
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        PaperProps={{
                                            style: {
                                                maxHeight: ITEM_HEIGHT * 4.5,
                                                width: '20ch',
                                            },
                                        }}
                                    >

                                        <MenuItem onClick={handleClose}>
                                            <RxTimer /> Last Day
                                        </MenuItem>
                                        <MenuItem onClick={handleClose}>
                                            <RxTimer /> Last Week
                                        </MenuItem>
                                        <MenuItem onClick={handleClose}>
                                            <RxTimer /> Last Month
                                        </MenuItem>
                                        <MenuItem onClick={handleClose}>
                                            <RxTimer /> Last Year
                                        </MenuItem>

                                    </Menu>
                                </div>
                            </div>
                            <h3 className="text-white font-weight-bold">$3,123,123.123</h3>
                            <p>$3,123.12 in last month</p>

                            <Chart
                                chartType="LineChart"
                                width="300px"
                                height="170px"
                                data={data}
                                options={options}
                            />
                        </div>
                    </div>
                </div>
                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Best Selling Products</h3>

                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4>SHOW BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    value={showBy}
                                    onChange={(e) => setshowBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-md-3">
                            <h4>CATRGORY BY</h4>
                            <FormControl size="small" className="w-100">
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    value={showBysetCatby}
                                    onChange={(e) => setshowBysetCatby(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>
                                        UID
                                    </th>
                                    <th style={{ width: '300px' }}>
                                        PRODUCT
                                    </th>
                                    <th>
                                        CATEGORY
                                    </th>
                                    <th>
                                        BRAND
                                    </th>
                                    <th>
                                        PRICE
                                    </th>
                                    <th>
                                        STOCK
                                    </th>
                                    <th>
                                        RATING
                                    </th>
                                    <th>
                                        ORDER
                                    </th>
                                    <th>
                                        SALES
                                    </th>
                                    <th>
                                        ACTION
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>#1</td>
                                    <td>
                                        <div className="d-flex align-items-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img">
                                                    <img src="https://nauankhongkho.com/wp-content/uploads/2015/11/lau-de-1.jpg" className="w-100" />
                                                </div>
                                            </div>
                                            <div className="info pl-0">
                                                <h6>Combo lau de 5 nguoi lon</h6>
                                                <p>Lau de gom nhung toping nhu xuong de, thit de, rau, nam, nuoc uong, ruou,...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>womans</td>
                                    <td>richman</td>
                                    <td>
                                        <div style={{ width: "70px" }}>
                                            <del className="old">$21.00</del>
                                            <span className="new text-danger">$21.00</span>
                                        </div>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(13)</td>
                                    <td>390</td>
                                    <td>$38k</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary" color="secondary"><FaEye /></Button>
                                            <Button className="success" color="success"><MdOutlineModeEdit /></Button>
                                            <Button className="error" color="error"><MdDeleteForever /></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#2</td>
                                    <td>
                                        <div className="d-flex align-items-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img">
                                                    <img src="https://nauankhongkho.com/wp-content/uploads/2015/11/lau-de-1.jpg" className="w-100" />
                                                </div>
                                            </div>
                                            <div className="info pl-0">
                                                <h6>Combo lau de 5 nguoi lon</h6>
                                                <p>Lau de gom nhung toping nhu xuong de, thit de, rau, nam, nuoc uong, ruou,...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>womans</td>
                                    <td>richman</td>
                                    <td>
                                        <div style={{ width: "70px" }}>
                                            <del className="old">$21.00</del>
                                            <span className="new text-danger">$21.00</span>
                                        </div>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(13)</td>
                                    <td>390</td>
                                    <td>$38k</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary" color="secondary"><FaEye /></Button>
                                            <Button className="success" color="success"><MdOutlineModeEdit /></Button>
                                            <Button className="error" color="error"><MdDeleteForever /></Button>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>#3</td>
                                    <td>
                                        <div className="d-flex align-items-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img">
                                                    <img src="https://nauankhongkho.com/wp-content/uploads/2015/11/lau-de-1.jpg" className="w-100" />
                                                </div>
                                            </div>
                                            <div className="info pl-0">
                                                <h6>Combo lau de 5 nguoi lon</h6>
                                                <p>Lau de gom nhung toping nhu xuong de, thit de, rau, nam, nuoc uong, ruou,...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>womans</td>
                                    <td>richman</td>
                                    <td>
                                        <div style={{ width: "70px" }}>
                                            <del className="old">$21.00</del>
                                            <span className="new text-danger">$21.00</span>
                                        </div>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(13)</td>
                                    <td>390</td>
                                    <td>$38k</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary" color="secondary"><FaEye /></Button>
                                            <Button className="success" color="success"><MdOutlineModeEdit /></Button>
                                            <Button className="error" color="error"><MdDeleteForever /></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#4</td>
                                    <td>
                                        <div className="d-flex align-items-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img">
                                                    <img src="https://nauankhongkho.com/wp-content/uploads/2015/11/lau-de-1.jpg" className="w-100" />
                                                </div>
                                            </div>
                                            <div className="info pl-0">
                                                <h6>Combo lau de 5 nguoi lon</h6>
                                                <p>Lau de gom nhung toping nhu xuong de, thit de, rau, nam, nuoc uong, ruou,...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>womans</td>
                                    <td>richman</td>
                                    <td>
                                        <div style={{ width: "60px" }}>
                                            <del className="old">$21.00</del>
                                            <span className="new text-danger">$21.00</span>
                                        </div>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(13)</td>
                                    <td>390</td>
                                    <td>$38k</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary" color="secondary"><FaEye /></Button>
                                            <Button className="success" color="success"><MdOutlineModeEdit /></Button>
                                            <Button className="error" color="error"><MdDeleteForever /></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#5</td>
                                    <td>
                                        <div className="d-flex align-items-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img">
                                                    <img src="https://nauankhongkho.com/wp-content/uploads/2015/11/lau-de-1.jpg" className="w-100" />
                                                </div>
                                            </div>
                                            <div className="info pl-0">
                                                <h6>Combo lau de 5 nguoi lon</h6>
                                                <p>Lau de gom nhung toping nhu xuong de, thit de, rau, nam, nuoc uong, ruou,...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>womans</td>
                                    <td>richman</td>
                                    <td>
                                        <div style={{ width: "60px" }}>
                                            <del className="old">$21.00</del>
                                            <span className="new text-danger">$21.00</span>
                                        </div>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(13)</td>
                                    <td>390</td>
                                    <td>$38k</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary" color="secondary"><FaEye /></Button>
                                            <Button className="success" color="success"><MdOutlineModeEdit /></Button>
                                            <Button className="error" color="error"><MdDeleteForever /></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#6</td>
                                    <td>
                                        <div className="d-flex align-items-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img">
                                                    <img src="https://nauankhongkho.com/wp-content/uploads/2015/11/lau-de-1.jpg" className="w-100" />
                                                </div>
                                            </div>
                                            <div className="info pl-0">
                                                <h6>Combo lau de 5 nguoi lon</h6>
                                                <p>Lau de gom nhung toping nhu xuong de, thit de, rau, nam, nuoc uong, ruou,...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>womans</td>
                                    <td>richman</td>
                                    <td>
                                        <div style={{ width: "60px" }}>
                                            <del className="old">$21.00</del>
                                            <span className="new text-danger">$21.00</span>
                                        </div>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(13)</td>
                                    <td>390</td>
                                    <td>$38k</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary" color="secondary"><FaEye /></Button>
                                            <Button className="success" color="success"><MdOutlineModeEdit /></Button>
                                            <Button className="error" color="error"><MdDeleteForever /></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#7</td>
                                    <td>
                                        <div className="d-flex align-items-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img">
                                                    <img src="https://nauankhongkho.com/wp-content/uploads/2015/11/lau-de-1.jpg" className="w-100" />
                                                </div>
                                            </div>
                                            <div className="info pl-0">
                                                <h6>Combo lau de 5 nguoi lon</h6>
                                                <p>Lau de gom nhung toping nhu xuong de, thit de, rau, nam, nuoc uong, ruou,...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>womans</td>
                                    <td>richman</td>
                                    <td>
                                        <div style={{ width: "60px" }}>
                                            <del className="old">$21.00</del>
                                            <span className="new text-danger">$21.00</span>
                                        </div>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(13)</td>
                                    <td>390</td>
                                    <td>$38k</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary" color="secondary"><FaEye /></Button>
                                            <Button className="success" color="success"><MdOutlineModeEdit /></Button>
                                            <Button className="error" color="error"><MdDeleteForever /></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#8</td>
                                    <td>
                                        <div className="d-flex align-items-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img">
                                                    <img src="https://nauankhongkho.com/wp-content/uploads/2015/11/lau-de-1.jpg" className="w-100" />
                                                </div>
                                            </div>
                                            <div className="info pl-0">
                                                <h6>Combo lau de 5 nguoi lon</h6>
                                                <p>Lau de gom nhung toping nhu xuong de, thit de, rau, nam, nuoc uong, ruou,...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>womans</td>
                                    <td>richman</td>
                                    <td>
                                        <div style={{ width: "60px" }}>
                                            <del className="old">$21.00</del>
                                            <span className="new text-danger">$21.00</span>
                                        </div>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(13)</td>
                                    <td>390</td>
                                    <td>$38k</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary" color="secondary"><FaEye /></Button>
                                            <Button className="success" color="success"><MdOutlineModeEdit /></Button>
                                            <Button className="error" color="error"><MdDeleteForever /></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#9</td>
                                    <td>
                                        <div className="d-flex align-items-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img">
                                                    <img src="https://nauankhongkho.com/wp-content/uploads/2015/11/lau-de-1.jpg" className="w-100" />
                                                </div>
                                            </div>
                                            <div className="info pl-0">
                                                <h6>Combo lau de 5 nguoi lon</h6>
                                                <p>Lau de gom nhung toping nhu xuong de, thit de, rau, nam, nuoc uong, ruou,...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>womans</td>
                                    <td>richman</td>
                                    <td>
                                        <div style={{ width: "60px" }}>
                                            <del className="old">$21.00</del>
                                            <span className="new text-danger">$21.00</span>
                                        </div>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(13)</td>
                                    <td>390</td>
                                    <td>$38k</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary" color="secondary"><FaEye /></Button>
                                            <Button className="success" color="success"><MdOutlineModeEdit /></Button>
                                            <Button className="error" color="error"><MdDeleteForever /></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>#10</td>
                                    <td>
                                        <div className="d-flex align-items-center productBox">
                                            <div className="imgWrapper">
                                                <div className="img">
                                                    <img src="https://nauankhongkho.com/wp-content/uploads/2015/11/lau-de-1.jpg" className="w-100" />
                                                </div>
                                            </div>
                                            <div className="info pl-0">
                                                <h6>Combo lau de 5 nguoi lon</h6>
                                                <p>Lau de gom nhung toping nhu xuong de, thit de, rau, nam, nuoc uong, ruou,...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>womans</td>
                                    <td>richman</td>
                                    <td>
                                        <div style={{ width: "60px" }}>
                                            <del className="old">$21.00</del>
                                            <span className="new text-danger">$21.00</span>
                                        </div>
                                    </td>
                                    <td>30</td>
                                    <td>4.9(13)</td>
                                    <td>390</td>
                                    <td>$38k</td>
                                    <td>
                                        <div className="actions d-flex align-items-center">
                                            <Button className="secondary" color="secondary"><FaEye /></Button>
                                            <Button className="success" color="success"><MdOutlineModeEdit /></Button>
                                            <Button className="error" color="error"><MdDeleteForever /></Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-flex tableFooter">
                            <p>showing <b>12</b> of <b>60</b> results</p>
                            <Pagination count={10} color="error" className="pagination" showFirstButton showLastButton />
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
export default Dashboard;