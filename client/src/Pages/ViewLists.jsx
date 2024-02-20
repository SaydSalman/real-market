import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper,SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from "swiper/modules"
import 'swiper/css/bundle'
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import {  useSelector } from 'react-redux';
import Contact from '../components/Contact';




function ViewLists() {
    SwiperCore.use([Navigation])
    const params = useParams()
    const [listing,setListing] = useState(null)
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)
    const [contact,setContact] = useState(false)
    const [copied, setCopied] = useState(false);
    useEffect(()=>{
        const fetchListing =async ()=>{
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${params.listingId}`)
            const data =await res.json()
            if(data.success == false){
                setError(true)
                setLoading(false)
                return
            }
            setListing(data)
            setLoading(false)
            setError(false)
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchListing()
    },[params.listingId])
    console.log(listing);
    const {currentUser} = useSelector((state)=>state.user)
  return (
    <main>
     {loading && <p className='text-center'>loading...</p>}
     {error && <p className='text-center'>Something went wrong...</p>}
     {listing && !loading && !error && (
      <div>
        <Swiper navigation>
          {listing.imageUrls.map((url)=>(
            <SwiperSlide key={url}>
              <div style={{width:'100%',height:'500px',border:'1px solid'}}>
              <img src={url} alt={listing.name} style={{width:'100%' , height: 'auto' }}/>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='d-flex gap-4'>
              <p className='bg-danger w-50 rounded text-center'>{listing.type === 'rent' ? 'For Rent' : 'For Sale'}</p>
              {listing.offer && (
                <p className='bg-success w-50 rounded text-center'>${+listing.regularPrice- +listing.discountPrice} offer</p>
              )}
            </div>
            </div>
            <p className='m-3 w-75'><span className='fw-bolder'>Description:</span> {listing.description}</p>
            <ul className='list-unstyled m-5 d-flex gap-4'>
              <li >
                <FaBed>
                  {listing.bedrooms>1 ? `${listing.bedrooms} beds`:`${listing.bedrooms} bed`}
                </FaBed>
              </li>
              <li >
                <FaBath>
                  {listing.bathrooms>1 ? `${listing.bathrooms} bathrooms`:`${listing.bathrooms} bathroom`}
                </FaBath>
              </li>
              <li >
                <FaParking>
                  {listing.parking ? 'Parking Spot':'No Parking'}
                </FaParking>
              </li>
              <li >
                <FaChair>
                  {listing.furnished ? 'furnished' : "not furnished"}
                  
                </FaChair>
              </li>
            </ul>
            {currentUser && listing.userRef!==currentUser._id&& !contact&&(
              <div className="row">
              <div className="col-lg-12 text-center">
                <div>
                  <button onClick={()=>setContact(true)} className='btn btn-secondary'>Contact Landlord</button>
                </div>
              </div>
            </div>
            )
              }
              {contact && <Contact listing={listing}/>}
      </div>
     )}
    </main>
  )
}

export default ViewLists
