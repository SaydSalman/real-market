
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import About from './Pages/About'
import Profile from './Pages/Profile'
import Header from './components/Header'
import Footer from './components/Footer'
import Listing from './Pages/Listing'

import PrivateRoute from './components/PrivateRoute';
import UpdateListing from './Pages/UpdateListing';
import ViewLists from './Pages/ViewLists';
import Search from './Pages/Search';


function App() {
  

  return (
    <>
      <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/sign-in" element={<SignIn />}/>
        <Route path="/sign-up" element={<SignUp />}/>
        <Route path="/about" element={<About />}/>
        <Route path='/search' element={<Search/>}/>
        <Route path="/listing/:listingId" element={<ViewLists />}/>
        <Route element={<PrivateRoute/>}>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/create-listing" element={<Listing />}/>
        <Route path="/update-listing/:listingId" element={<UpdateListing />}/>
        </Route>
        
        
        {/* <Route path='/*' element={<Navigate to={'/'}/>}/> */}
      </Routes>
      <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
