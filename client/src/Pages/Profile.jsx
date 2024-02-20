import React, { useEffect, useRef, useState } from 'react'
import profile from "../assets/images/Sayyu pic.jpeg"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart,updateUserSuccess,updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice';

function Profile() {
const fileRef = useRef(null)
  const {currentUser,loading,error} = useSelector((state)=>state.user)
  const [file,setFile] = useState(undefined)
  const [filePerc,setFilePerc] = useState(0)
  const [fileUploadError,setFileUploadError] =useState(false)
  const [formData,setFormData] = useState({})
  const [updateSuccess,setUpdateSuccess] =useState(false)
  const [ShowListingsError,setShowListingsError] = useState(false)
  const [userListings,setUserListings]= useState({})
  const dispatch = useDispatch()
  // console.log(file);
  console.log(formData);
  // console.log(filePerc);
  // console.log(fileUploadError);
  useEffect(()=>{
    if(file){
      handleFileUpload(file) //we need to pass the file
    }
  },[file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilepic: downloadURL })
        );
      }
    );
  };
  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }
  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,
      {
        method:'POST',
        headers:{
          "Content-Type":"application/json"
          
        },
        body:JSON.stringify(formData)
      })
      const data = await res.json()
      if(data.success===false){
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message),{
        
      })
    }
  }
  const handleDeleteUser =async ()=>{
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,
      {
        method:'DELETE'
      })
      const data = await res.json()
      if(data.success===false){
        dispatch(deleteUserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
   
  const handleSignOut =async ()=>{
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if(data.success==false){
        dispatch(signOutUserFailure(data.message))
        return
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(data.message))
    }
  }
  const handleShowListings = async()=>{
    try {
      setShowListingsError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()
      if(data.success==false){
        setShowListingsError(true)
        return;
      }
      setUserListings(data)
    } catch (error) {
      setShowListingsError(true)
    }
  }
  const handleListingDelete =async (listingId)=>{
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`,
      {
        method:'DELETE'
      })
      const data = await res.json()
      if(data.success == false){
        console.log(data.message);
        return;
      }
      setUserListings((prev)=>prev.filter((listing)=>listing._id!==listingId))
    } catch (error) {
      console.log(error.message);
    }
  }
  
  return (
    <>
    {/* // files is an array and it contain lot of objects and we need from 1st one */}
      <div className='container'>
        <h1 className='text-center mt-5'>Profile</h1>
        <form onSubmit={handleSubmit} className='d-flex flex-column justify-content-center align-items-center'>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/.*'/> 
          <img onClick={()=>fileRef.current.click()} style={{width:'60px',height:'60px'}} className='rounded-circle mt-2' src={formData.profilepic || currentUser.profilepic} alt="" />
          
          <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-danger'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-success'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-success'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
          <input onChange={handleChange} defaultValue={currentUser.username} type="text" placeholder='username' id='username' className='form-control w-50 mt-3' />
          <input onChange={handleChange} defaultValue={currentUser.email} type="email" placeholder='email' id='email' className='form-control w-50 mt-3' />
          <input onChange={handleChange} type="password" placeholder='password' id='password' className='form-control w-50 mt-3' />
          <button disabled={loading} className='btn btn-secondary mt-2 w-50'>{loading? 'loading...':'Update'}</button>
          <Link className='btn btn-success w-50 mt-3' to={"/create-listing"}>
            Create Listing
          </Link>
        </form>
        <div className='d-flex justify-content-center gap-5 mt-4'>
          <span onClick={handleDeleteUser} className='text-light btn btn-danger'>Delete Account</span>
          <span onClick={handleSignOut} className='text-light btn btn-success'>Sign Out</span>
        </div>
        <p className='text-danger text-center mt-5'>{error ? error: ""}</p>
        <p className='text-center text-success mt-3 fw-bolder'>{updateSuccess ? "User is Updated Succesffuly!!!": ""}</p>
        <div className='d-flex justify-content-center '><button onClick={handleShowListings} className='btn btn-success '>Show Listings</button>
        <p>{ShowListingsError?"Error Show Listings":""}</p>
       
        </div>
        {userListings && userListings.length>0 && userListings.map((listing,index)=>(
          <div key={listing._id} className='d-flex align-items-center border'>
          <Link to={`/listing/${listing._id}`}>
            <img className='w-25 mt-4' src={listing.imageUrls[0]} alt="listing cover" />
          </Link>
          <Link style={{textDecoration:"none"}} to={`/listing/${currentUser._id}`}>
            <p className='text-secondary'>{listing.name}</p>
          </Link>
          <div>
            <button onClick={()=>handleListingDelete(listing._id)} className='btn btn-danger mb-2 p-3'>Delete</button>
            <Link to={`/update-listing/${listing._id}`}><button  className='btn btn-success mb-2 p-4'>Edit</button></Link>
          </div>
          </div>
        ))

        }
      </div>
    </>
  )
}

export default Profile
