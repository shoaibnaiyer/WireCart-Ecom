import 'bootstrap/dist/css/bootstrap.min.css'
// import Navbar from './components/Navbar'
import { Box } from '@mui/material'
import { useEffect } from 'react'
import Navbar1 from './components/Navbar1'
import Footer from './components/Footer'
import Register from './Auth/Register'
import Register1 from './Auth/Register1'
import Login from './Auth/Login'
import LoginCustomer from './Auth/LoginCustomer'
import LoginAdmin from './Auth/LoginAdmin'
import Home from './pages/Home'
import DashboardAdmin from './pages/Admin/DashboardAdmin'
import DashboardCustomer from './pages/Customer/DashboardCustomer'
import Profile from './pages/Customer/Profile'
import DashboardSeller from './pages/DashboardSeller'
import Inventory from './pages/Admin/Inventory'
import CustomerList from './pages/Admin/CustomerList'
import OrderList from './pages/Admin/OrderList'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'

// import './App.css'


function App() {
  const isUserSignedIn = !!localStorage.getItem('token')
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to a specific route if the condition is met
    if (location.pathname === '/') {
      navigate('/');
    }
  }, [location.pathname, navigate]);

  return (
    // <BrowserRouter>
    <Box display="flex" flexDirection="column" minHeight="100vh">
    {/* <div className='main-container'> */}
      <Navbar1 />
      {/* <Navbar /> */}
      <Box flexGrow={1}>
      <Routes>
        {!isUserSignedIn && (
          <>
            <Route path="/" element={<Home />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/register1" element={<Register1 />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/login-customer" element={<LoginCustomer />}></Route>
            <Route path="/login-admin" element={<LoginAdmin />}></Route>
          </>
        )}
        {isUserSignedIn && (
          <>
            <Route path="/" element={<Home />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/customer-dashboard" element={<DashboardCustomer />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/seller-dashboard" element={<DashboardSeller />}></Route>
            <Route path="/admin-dashboard" element={<DashboardAdmin />}></Route>
            <Route path="/inventory" element={<Inventory />}></Route>
            <Route path="/customer-list" element={<CustomerList />}></Route>
            <Route path="/order-list" element={<OrderList />}></Route>
          </>
        )}
      </Routes>
      </Box>
      <Footer />
      </Box >
    // </div >
    // </BrowserRouter>
  )
}

export default App;