import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <>
      <div style={{ width: '100%', height: '300px' }} className=' mt-5'>
        <div className="container   ">
          <div className="row m-2 ">
            <div className="col-lg-3">
              <div className='d-flex flex-column justify-content-center align-items-center'>
                <h4 style={{ height: '30px' }}>Real Estate</h4>
                <span>Designed and built with all the love in the world by  Luminar team with the help of our contributors</span>
                <span className='mt-1'>Code Licensed Luminar,done CC BY 3.0</span>
                <span className='mt-1 mb-2'>Currently v1.0.0</span>
              </div>
            </div>
            <div className="col-lg-3 ">
              <h4 className='ms-3 text-center' style={{ height: '30px' }}>Links</h4>
              <ul className='list-unstyled'>
                <li className='text-center '><Link style={{ textDecoration: 'none',color:'black' }} to={'/'}>Home</Link></li>
                <li className='text-center'><Link style={{ textDecoration: 'none',color:'black' }} to={'/view'}>View</Link></li>
                <li className='text-center'><Link style={{ textDecoration: 'none',color:'black' }} to={'/listing'}>list</Link></li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h4 className='ms-3 text-center' style={{ height: '30px' }}>Guides</h4>
              <ul className='list-unstyled'>
                <li className='text-center'>React</li>
                <li className='text-center'>React Bootstrap</li>
                <li className='text-center'>Routing</li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h4 style={{ height: '30px' }}>Contact Us</h4>
              <div className='d-flex'>
                <input placeholder='Enter Your Email' className='form-control' type="text" />
                <button className='btn btn-warning ms-2'><i className="fa-solid fa-arrow-right"></i></button>
              </div>
              <div className='d-flex justify-content-between mt-2'>
                <div>
                  <i style={{ height: '"50px"}}' }} className="fa-brands fa-linkedin fa-2x " />
                  <i className="fa-brands fa-github fa-2x " />
                  <i className="fa-brands fa-youtube fa-2x  " />
                  <i className="fa-brands fa-twitter fa-2x " />
                  <i className="fa-brands fa-facebook fa-2x " />
                </div>

              </div>
            </div>
          </div>
          <div className="row">
            <div className='text-center mt-2'>
              <span>Copyright @ 2023 E cart .Built with React</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
