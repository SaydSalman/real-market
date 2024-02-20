import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Listing() {
    const handlecreate = ()=>{
        toast.info("You Have created the list")
    }
    const navigate = useNavigate()
    const [files,setFiles] = useState([])
    const {currentUser} = useSelector(state=>state.user)
    const [uploading,setUploading] = useState(false)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(false)
    const [formData,setFormData] = useState({
      imageUrls:[], //for the images
      name:'',
      description:"",
      address:"",
      type:"rent",
      bedrooms:1,
      bathrooms:1,
      regularPrice:50,
      discountPrice:0,
      offer:false,
      parking:false,
      furnished:false
    })
    const [imageUploadError,setImageUploadError] = useState(false)
    console.log(formData);
    console.log(files);
    const handleImageSubmit = (e)=>{
      if(files.length>0 && files.length + formData.imageUrls.length <7 ){
        setUploading(true)
        setImageUploadError(false)
        const promises = []
        for(let i=0 ; i<files.length ; i++){
          promises.push(storeImage(files[i])) //it contains all the files
        }
        Promise.all(promises).then((urls)=>{
          setFormData({...formData,imageUrls:formData.imageUrls.concat(urls),
          })
          setImageUploadError(false)
          setUploading(false)
        }).catch((err)=>{
          setImageUploadError('Image Upload Failed (2mb max per image')
          setUploading(false)
        })
        
      }else{
        setImageUploadError("Max 6 Images Allowed");
        setUploading(false)
      }
    }
    const storeImage = (file)=>{
      return new Promise ((resolve,reject)=>{
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage,fileName); //create stiarge ref whichis coming from firebase andpass the storage and filename
        const uploadTask = uploadBytesResumable(storageRef,file)
        uploadTask.on(
          "state_changed",
          (snapshot)=>{
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
              console.log(`Upload is ${progress}% done`);
              
          },
          (error)=>{
            reject(error)
          },
          ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{ //use getdownload ur its a function from firebase stoarge and going to pass uploadtask.snapshot.ref and it gives a download url and result result url
              resolve(downloadURL)
            })
            //now everything will be store inside the promises which created on the above
          }
        )
      })
    }
    const handleRemoveImage = (index)=>{
      setFormData({...formData,imageUrls:formData.imageUrls.filter((_,i)=>i!==index)}) //remove the one which have index
    }
    const handleChange = (e)=>{
      if(e.target.id==="sale" || e.target.id==="rent"){
        setFormData({...
        formData,
      type:e.target.id})
      }
      if(e.target.id == "parking" || e.target.id == "furnished" || e.target.id == "offer"){
        setFormData({
          ...formData,
          [e.target.id]:e.target.checked
        })
      }
      if(e.target.type == "number" || e.target.type == "text" || e.target.type== "textarea"){
        setFormData({...formData,
        [e.target.id]:e.target.value})
      }
    };
    const handleSubmit =async (e)=>{
      e.preventDefault()
      try {
        if(formData.imageUrls.length<1) return setError("you must upload one image")
        if(+formData.regularPrice<+formData.discountPrice) return setError("Discount Price should be lower than the regular price")
        setLoading(true)
        setError(false)
        const res = await fetch('/api/listing/create',{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({...formData,userRef:currentUser._id})
        })
        const data = await res.json()
        setLoading(false)
        if(data.success === false){
          setError(data.message)
        }
        navigate(`/listing/${data._id}`)
      } catch (error) {
        setError(true)
        setLoading(false)
      }
    }
  return (
    <>
      <main className='p-3 mx-auto'>
        <h1 className='text-center mt-5'>Create a Listing</h1>
        <form  className='gap-2' >
          <div class="container">
            <div className="row">
              <div className="col-lg-6">
              <div className='d-flex flex-column gap-3'>
                <input type="text" className='form-control border' id='name' placeholder='Name' maxLength="62" minLength="10" required onChange={handleChange} value={formData.name}/>
                <textarea type="text" className='form-control border' id='description' placeholder='Description'  required onChange={handleChange} value={formData.description} />
                <input type="text" className='form-control border' id='address' placeholder='Address'  required onChange={handleChange} value={formData.address}/>
             <div className='d-flex justify-content-between'>
              <div className='d-flex gap-2'>
                <input type="checkbox" id='sale' className='' onChange={handleChange} checked={formData.type==="sale"} />
                <span>Sail</span>
              </div>
              <div className='d-flex gap-2'>
                <input type="checkbox" id='rent' className='' onChange={handleChange} checked={formData.type==="rent"} />
                <span>Rent</span>
              </div>
              <div className='d-flex gap-2'>
                <input type="checkbox" id='parking' className='' onChange={handleChange} checked={formData.parking} />
                <span>Parking spot</span>
              </div>
              <div className='d-flex gap-2'>
                <input type="checkbox" id='furnished' className=''onChange={handleChange} checked={formData.furnished} />
                <span>Furnished</span>
              </div>
              <div className='d-flex gap-2'>
                <input type="checkbox" id='offer' className=''onChange={handleChange} checked={formData.offer} />
                <span>Offer</span>
              </div>
             </div>
             <div className='d-flex flex-wrap gap-3'>
              <div className='d-flex gap-2 align-items-center'>
              <input type="number" id='bedrooms' min="1" max="10" required className='rounded' onChange={handleChange} value={formData.bedrooms} />
              <span>Beds</span>
              </div>
              <div className='d-flex gap-2 align-items-center'>
              <input type="number" id='bathrooms' min="1" max="10" required className='rounded' onChange={handleChange} value={formData.bathrooms} />
              <span>Baths</span>
              </div>
              <div className='d-flex gap-2 align-items-center'>
              <input type="number" id='regularPrice' min="50" max="10000" required className='rounded' onChange={handleChange} value={formData.regularPrice} />
              <div>
              <span>Regular Price</span>
              <span className='text-fs-5'>($ / months)</span>
              </div>
              
              </div>
              {formData.offer && (<div className='d-flex gap-2 align-items-center'>
              <input type="number" id='discountPrice' min="0" max="100000000" required className='rounded' onChange={handleChange} value={formData.discountPrice} />
              <div>
              <span>Discounted Price</span>
              <span className='text-fs-5'>($ / months)</span>
              </div>
              </div>)}
             </div>
              </div>
              </div>
              <div className="col-lg-6">
                  <div className='mt-2'>
                    <p className='fw-bold'>Images:
                    <span className='text-secondary'>The first Image will be Cover(max 6)</span> </p>
                    <div className='d-flex gap-2 '>
                      <input onChange={(e)=>setFiles(e.target.files)} className='border p-2' type="file" id='images' accept='image/*' multiple />
                      <button disabled={uploading} onClick={handleImageSubmit} type='button' className='btn btn-success'>{uploading?"Uploading":'Upload'}</button>
                    </div>
                    <p className='text-danger'>{imageUploadError && imageUploadError}</p>
                    <div>
                      {
                        formData.imageUrls.length>0 && formData.imageUrls.map((img,index)=>(
                          <div key={img} className='d-flex justify-content-between p-3 align-items-center'>
                            <img src={img} alt="listing image" className='w-25  rounded img-fluid' />
                            <button onClick={()=>handleRemoveImage(index)} className='btn btn-danger' >Delete</button>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  <button disabled={loading || uploading} onClick={handleSubmit} className='btn btn-secondary w-75 mt-3'>{loading?"Creating":"Create Listing"}</button>
                  {error && <p className='text-danger'>{error}</p>}
                  
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  )
}

export default Listing
