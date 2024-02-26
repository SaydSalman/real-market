import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

function Home() {

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
   SwiperCore.use([Navigation])
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <>
    <div className='container'>
      <div className="row">
        <div className="col-lg-6 d-flex justify-content-center align-items-center flex-column" style={{minHeight:'50vh'}}>
        <h1 style={{height:'100px'}}>Find Your Next Perfect <br />Place with Ease</h1>
        <span className='ms-auto'>Sahand Estate will help you to  find your dream place in a few steps.</span><br/><br/>
        <div >
          <a className='btn btn-warning'><Link style={{textDecoration:'none' ,color:'black'}} to={'/search'}>Lets Start Now...</Link></a>
        </div>
        </div>
        
        <div className="col-lg-6"></div>
      </div>
    </div>
    <div className='row'>
    <div className='col-lg-12'>
      <Swiper Navigation>
        {offerListings && offerListings.length >0 && offerListings.map((listing)=>(
  
         <SwiperSlide key={listing._id}> <div style={{width:'100%'}}><img src={listing.imageUrls[0]} style={{width:'100%',height:'100vh'}} alt="" /></div></SwiperSlide>
        ))}
      </Swiper>
    </div>
    </div>
    <div className='container-fluid p-5'>
      <div>
        {offerListings && offerListings.length>0 && (
          <div>
            <div>
              <h2>Recent Offers</h2>
              <Link to={`/search?offer=true`}>
                Show More Offers
              </Link>
              <div className='d-flex flex-wrap gap-4'>
                {
                  offerListings.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          </div>
        )}
        {saleListings && saleListings.length>0 && (
          <div>
            <div>
              <h2>Recent places for Sale</h2>
              <Link to={`/search?type=sale`}>
                Show More Places for Sale
              </Link>
              <div className='d-flex flex-wrap gap-4'>
                {
                  saleListings.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          </div>
        )}
        {rentListings && rentListings.length>0 && (
          <div>
            <div>
              <h2>Recent places for rent</h2>
              <Link to={`/search?type=rent`}>
                Show More places for rent
              </Link>
              <div className='d-flex flex-wrap gap-4'>
                {
                  rentListings.map((listing)=>(
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
    </>
  )
}

export default Home
