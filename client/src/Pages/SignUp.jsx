import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'


function SignUp() {
  const [formData,setFormData] = useState({})
  const [error,setError] = useState(null)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }
  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      setLoading(true) //before sending request set loading to true
    const result = await fetch('/api/auth/signup',
    {
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(formData)
    }
    )
    // change and convert to json
    const data = await result.json()
    console.log(data);
    if(data.success === false){
      setLoading(false)
      setError(data.message)
      
      return
    }
      setLoading(false) //bcz loading is completed
      setError(null)
      navigate('/sign-in')
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
    
    }
    
    
  
  console.log(formData);
  return (
    <>
       <div style={{width:'100%',height:'100vh'}}>
       <h1 className='text-center fw-bolder mt-2'>SignUp</h1>
         <div className='d-flex justify-content-center align-items-center flex-column'>
          
          <form onSubmit={handleSubmit} className='d-flex justify-content-center align-items-center flex-column gap-4 mt-3' >
            <input type="text" onChange={handleChange} placeholder='username' className='form-control' id='username' />
            <input type="email" onChange={handleChange} placeholder='email' className='form-control' id='email' />
            <input type="password" onChange={handleChange} placeholder='password' className='form-control' id='password' />
            <button disabled={loading} className="btn btn-success" >{loading? 'Loading...': "Sign Up"}</button>
            <OAuth/>
         </form>
          <div className='d-flex gap-2 mt-2'> 
            <p>Have an Account?</p>
            <Link to={'/sign-in'}>
              <span>Sign In</span>
            </Link>
          </div>
          {error&& <p className='text-danger text-center'>{error}</p>}
         </div>
       </div>
    </>
  )
}

export default SignUp
