import React from 'react'
import { Link } from 'react-router-dom'
import { FaLocationDot } from "react-icons/fa6";
import Card from 'react-bootstrap/Card';

function ListingItem({listing}) {
  return (
    <>
       
            
                <Link style={{textDecoration:'none'}} to={`/listing/${listing._id}`}>
                <Card className='shadow' style={{ width: '18rem',height:'26rem' }}>
              <Card.Img style={{width:'18rem'}} variant="top" src={listing.imageUrls[0] || "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"} />
              <Card.Body style={{height:'20rem'}} className='p-3'>
                <Card.Title className='text-truncate'>{listing.name}</Card.Title>
                <Card.Text className='d-flex align-items-center gap-2'>
                <FaLocationDot style={{width:'20px',height:'20px',color:'green'}} />
                <p className='text-truncate'>{listing.address}</p>
                </Card.Text>
                <Card.Text>
                  <p className='text-truncate'>{listing.description}</p>
                </Card.Text>
                <Card.Text>
                  <p className='text-truncate fw-bolder'>$ {listing.offer ? listing.discountPrice.toLocaleString('en-US'):listing.regularPrice.toLocaleString('en-US')}
                  {listing.type === 'rent' && ' / month'}</p>
                </Card.Text>
                <div className='text-secondary d-flex gap-2 '>
                    <div className='fw-bolder fw-5 '>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                        
                    </div>
                    <div className='fw-bolder fw-5 '>
                    {listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom`}
                        
                    </div>
                </div>
            
              </Card.Body>
            </Card>
                </Link>
            
       
    </>
  )
}

export default ListingItem