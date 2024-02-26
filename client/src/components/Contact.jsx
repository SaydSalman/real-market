import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'




function Contact({ listing }) {
    
    const [landlord,setLandlord] = useState(null)
    const [message,setMessage] = useState('')
    useEffect(()=>{
        const fetchLandlord = async ()=>{
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json()
                setLandlord(data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandlord()
    },[listing.userRef])
    const onChange = (e)=>{
        setMessage(e.target.value)
    }
    return (
        <>
            {landlord && (
                <div className='d-flex flex-column gap-2'>
                <p>Contact :<span className='fw-bolder'>{landlord.username}</span> for <span className='fw-bold'>{listing.name.toLowerCase()}</span></p>
                <textarea name='message' id='message' rows={2} value={message} onChange={onChange} placeholder='Enter Your Message here...' className='form-control border p-3'></textarea>
                <Link className='btn btn-success align-items-center' to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}>Send Message...</Link>
                </div>
                
            )}
        </>
    )
}

export default Contact