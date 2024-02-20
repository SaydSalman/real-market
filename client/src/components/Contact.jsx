import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState('')
    const onChange = (e) => {
        setMessage(e.target.value)
    }
    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchLandlord();
    }, [listing.userRef]);

    const handleSendMessage = () => {
        try {
            // 

            console.log('Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }



    return (
        <>
            {
                landlord && (
                    <div>
                        <p>Contact: <span className='fw-bolder'>{landlord.username}</span> for <span>{listing.name.toLowerCase()}</span></p>
                        <textarea
                            name='message'
                            id='message'
                            rows='2'
                            value={message}
                            onChange={onChange}
                            placeholder='Enter your message here...'
                            className='form-control'
                        ></textarea>
                        <div className='text-center'>
                            {/* <Link
                                to={`mailto:${landlord.email}?subject=Regarding ${encodeURIComponent(listing.name)}&body=${encodeURIComponent(message)}`}
                                className='text-decoration-none mt-3'
                            >
                                Send Message
                            </Link> */}
                            <Link
      to={`mailto:${landlord.email}?subject=Regarding ${encodeURIComponent(listing.name)}&body=${encodeURIComponent(message)}`}
      className='text-decoration-none mt-3'
      onClick={handleSendMessage}
    >
      Send Message
    </Link>

                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Contact