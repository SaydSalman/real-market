import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

function Search() {
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
      });
      const [loading,setLoading] = useState(false)
      const [listings, setListings] = useState([]);
      const [showMore, setShowMore] = useState(false);
      console.log(listings);
      useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
        searchTermFromUrl ||
        typeFromUrl ||
        parkingFromUrl ||
        furnishedFromUrl ||
        offerFromUrl ||
        sortFromUrl ||
        orderFromUrl
      ) {
        setSidebardata({
          searchTerm: searchTermFromUrl || '',
          type: typeFromUrl || 'all',
          parking: parkingFromUrl === 'true' ? true : false,
          furnished: furnishedFromUrl === 'true' ? true : false,
          offer: offerFromUrl === 'true' ? true : false,
          sort: sortFromUrl || 'created_at',
          order: orderFromUrl || 'desc',
        });
      }

      const fetchListings = async()=>{
        setLoading(true)
        setShowMore(false)
        const searchQuery = urlParams.toString()
        const res = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await res.json()
        if(data.length>8){
        setShowMore(true)
        
      }else{
        setShowMore(false)
      }
      setListings(data)
        setLoading(false)
      }
      fetchListings()
      },[location.search])
      
      console.log(sidebardata);
    const navigate = useNavigate()
    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
          setShowMore(false);
        }
        setListings([...listings, ...data]);
      };
    const handleChange = (e) => {
        if (
          e.target.id === 'all' ||
          e.target.id === 'rent' ||
          e.target.id === 'sale'
        ) {
          setSidebardata({ ...sidebardata, type: e.target.id });
        }
    
        if (e.target.id === 'searchTerm') {
          setSidebardata({ ...sidebardata, searchTerm: e.target.value });
        }
    
        if (
          e.target.id === 'parking' ||
          e.target.id === 'furnished' ||
          e.target.id === 'offer'
        ) {
          setSidebardata({
            ...sidebardata,
            [e.target.id]:
              e.target.checked || e.target.checked === 'true' ? true : false,
          });
        }
    
        if (e.target.id === 'sort_order') {
          const sort = e.target.value.split('_')[0] || 'created_at';
    
          const order = e.target.value.split('_')[1] || 'desc';
    
          setSidebardata({ ...sidebardata, sort, order });
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
      };

      
  return (
    <div className='container-fluid'>
    <div className="row">
        <div  className="col-lg-4 border ">
            <form onSubmit={handleSubmit} action="">
                <div className='d-flex gap-2 mt-2 align-items-center'>
                    <label htmlFor="">Search Term</label>
                    <input type="text" id='searchTerm' placeholder='Search...' className='form-control w-75' value={sidebardata.searchTerm} onChange={handleChange}  />
                </div>
                <div className='d-flex align-items-center gap-2 mt-2'>
                    <label htmlFor="">Type</label>
                    <input type="checkbox" name="" id="all" onChange={handleChange} checked={sidebardata.type=='all'} />
                    <label htmlFor="">Rent & Sale</label>
                    <input type="checkbox" name="" id="rent" onChange={handleChange} checked={sidebardata.type=='rent'} />
                    <label htmlFor="">Rent Only</label>
                    <input type="checkbox" name="" id="sale" onChange={handleChange} checked={sidebardata.type=='sale'} />
                    <label htmlFor="">Sale Only</label>

                </div>
                <div className='mt-2 '>
                    <input type='checkbox' id='offer' onChange={handleChange} checked={sidebardata.offer}></input>
                    <label className='ms-2' htmlFor="">Offer</label>
                </div>
                <div className='d-flex align-items-center gap-2 mt-2'>
                    <label htmlFor="">Amenities: </label>
                    <input type="checkbox" name="" id="parking" onChange={handleChange} checked={sidebardata.parking} />
                    <label htmlFor="">Parking</label>
                    <input type="checkbox" name="" id="furnished" onChange={handleChange} checked={sidebardata.furnished} />
                    <label htmlFor="">Furnished</label>
                    

                </div>
                <div className='mt-2 gap-2'>
                    
                    <label className='ms-2' htmlFor="">Sort:</label>
                    <select
                    onChange={handleChange}
                    defaultValue={'created_at_desc'}
                     className='border p-2 ms-2 ' name="" id="sort_order">
                        <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to hight</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
                    </select>
                </div>
                <div className='d-grid w-75  mt-3'><button className='btn btn-secondary'>Search</button></div>
            </form>
        </div>
        <div className="col-lg-8 p-5 ">
    <h4>Listing Results:</h4>
    
        
            {!loading && listings.length === 0 && (
                <p className='text-center text-warning'>No listing found!!!</p>
            )}
            {loading && (
                <p className=' text-secondary'>loading...</p>
            )}
            
                <div className='row d-flex justify-content-center align-items-center '>
                    {!loading &&
                        listings &&
                        listings.map((listing) => (
                          <div className='col-lg-6'><ListingItem key={listing._id} listing={listing} />
                         
                          </div>
                          
                        ))}
                        {showMore && (
                            <button className='mt-2' onClick={onShowMoreClick}>
                                Show More
                            </button>
                        )}
                        
                </div>
            
        
    
        </div>
    </div>
      
    </div>
  )
}

export default Search
