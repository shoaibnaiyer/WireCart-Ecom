import 'bootstrap/dist/css/bootstrap.min.css'
// import Navbar from './components/Navbar'
import { useEffect } from 'react'
import Navbar1 from './components/Navbar1'
import Register from './Auth/Register'
import Login from './Auth/Login'
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

  // const [load, setLoad] = useState(false);

  // useEffect(() => {
  //   // Reload the app only when the route changes to a certain path
  //   if (location.pathname === '/example') {
  //     window.location.reload();
  //   }
  //   setLoad(()=>!load)
  // }, [load, location.pathname]);

  useEffect(() => {
    // Redirect to a specific route if the condition is met
    if (location.pathname === '/') {
      navigate('/');
    }
  }, [location.pathname, navigate]);

  return (
    // <BrowserRouter>
    <div className='main-container'>
      <Navbar1 />
      {/* <Navbar /> */}
      <Routes>
        {!isUserSignedIn && (
          <>
            <Route path="/" element={<Home />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
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
    </div>
    // </BrowserRouter>
  )
}

export default App;