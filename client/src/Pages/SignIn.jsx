import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import { Link, useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'


function SignIn() {
  const [formData,setFormData] = useState({})
  const dispatch = useDispatch()
  const {loading,error} = useSelector((state)=>state.user) //instead of two state we can destructure using useSelector and it provide state and state name is user
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
      dispatch(signInStart()) //before sending request set loading to true
    const result = await fetch('/api/auth/signin',
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
      dispatch(signInFailure(data.message))
      
      return
    }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure())
    }
    
    }
    
    
  
  console.log(formData);
  return (
    <>
       <div style={{width:'100%',height:'100vh'}}>
       <h1 className='text-center fw-bolder mt-2'>Sign In</h1>
         <div className='d-flex justify-content-center align-items-center flex-column'>
          
          <form onSubmit={handleSubmit} className='d-flex justify-content-center align-items-center flex-column gap-4 mt-3' >
            
            <input type="email" onChange={handleChange} placeholder='email' className='form-control' id='email' />
            <input type="password" onChange={handleChange} placeholder='password' className='form-control' id='password' />
            <button disabled={loading} className="btn btn-success" >{loading? 'Loading...': "Sign In"}</button>
          <OAuth/>
          </form>
          <div className='d-flex gap-2 mt-2'> 
            <p>Dont Have an Account?</p>
            <Link to={'/sign-up'}>
              <span>Sign Up</span>
            </Link>
          </div>
          {error&& <p className='text-danger text-center'>{error}</p>}
         </div>
       </div>
    </>
  )
}

export default SignIn
