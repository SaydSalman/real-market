import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaSearch } from "react-icons/fa";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useSelector } from 'react-redux';


function Header() {
  const {currentUser} = useSelector(state=>state.user) //here we get current user from the slice name 
  const [searchTerm,setSearchTerm] = useState('')
  const navigate = useNavigate()
  const handleSubmit = (e)=>{
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search) // and we have to add this on window.location.search
    urlParams.set('searchTerm',searchTerm)// we have to set the searchterm to our searchTerm thatw e type there
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm'); //here we need to get the search term
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  console.log("Full URL: " + window.location.href);
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand ><Link style={{textDecoration:'none'}} to={'/'}>Real Estate</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center justify-content-center">
            <Nav.Link ><Link style={{textDecoration:'none',color:'black'}} to={'/'}>Home</Link></Nav.Link>
            <Nav.Link ><Link style={{textDecoration:'none',color:'black'}} to={'/about'}>About</Link></Nav.Link>
            {/* <Nav.Link ><Link style={{textDecoration:'none',color:'black'}} to={'/profile'}>Profile</Link></Nav.Link> */}
            
            <InputGroup className="">
            <input type='text'
            placeholder='Search...'
            className='form-control'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
        <InputGroup.Text  id="basic-addon1"><FaSearch onClick={handleSubmit}  /></InputGroup.Text>
        
      </InputGroup>
      
      
      <Nav.Link ><Link style={{textDecoration:'none',color:'black'}} to={'/profile'}>{currentUser?(
        <img style={{width:'60px',height:'60px'}} className='rounded-circle ' src={currentUser.profilepic} alt="profile" />
      ):(
        <li>Sign In</li>
      )}</Link></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  )
}

export default Header
