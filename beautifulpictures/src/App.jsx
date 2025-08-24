import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Key = "MfcgBp0ax9DY23ItLMgQOHpKXUhbbGrcyPlIeNdHVzTqgZhrfPz11Z9P";

export default function App(){
  const [query, setQuery] = useState("")
  const [images, setImages] =useState([])
  const [selected, setSelected] = useState(null)
  const [viewed, setViewed] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")



  useEffect(function(){
    async function fetchImages(){ 
      if(query.length <= 2) return;
      try{
      setLoading(true)
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&per_page=10`,
        {
      headers: {
        Authorization: "MfcgBp0ax9DY23ItLMgQOHpKXUhbbGrcyPlIeNdHVzTqgZhrfPz11Z9P"
      }
    }
  )
  if(!res.ok)
  throw new Error ("Something went wrong") // this is not realy needed
  const data= await res.json()
  if(data.total_results === 0)throw new Error("Photo not found");
      setImages(data.photos) // will come here later
}catch(err){
  console.log(err.message);
  setError(err.message)
} finally{
  setLoading(false)
}
  }

    fetchImages()
  }, [query])

   function displayDetails(id){
    setSelected(id)
   }
   function handleViewImages(image){
    setViewed((viewed)=>[
      ...viewed, image
    ])
    }

   
  return (
    <div className="w-12/12 bg-[#1e293b]">
      <Form query={query} setQuery={setQuery} images={images} />
      <div className="flex w-10/12 mr-auto ml-auto">
        {loading && <Loading />}
        <div className="bg-[#1e293b] border rounded-lg w-1/2 mt-2 ml-3">
          <Open
            element={
              <Images
                images={images}
                setImages={setImages}
                ondisplayDetails={displayDetails}
              />
            }
          />
        </div>
        {error && <ErrorMessage message={error} />}
        <div className="border rounded-lg w-1/2 mt-2 ml-3">
        {selected ?(
           <ImageDetails
        selected={selected}
        setSelected={setSelected}
        onViewImages={handleViewImages}
        viewed={viewed}
      />
        ):(
          <Open2
            element2={
              <ImagesViewed
                onViewImages={handleViewImages}
                viewed={viewed}
                setViewed={setViewed}
              />
            }
          />)}
      </div>
    </div>
    </div>
  )
}
function ErrorMessage({message}){
  return(
    <p className="text-red-500"><span><em>{message}</em></span></p>
  )
}

function Loading(){
  return(
    <div>
      <p>...Loading</p>
    </div>
  )
}

 function Open({element}){
  const [open, setOpen] = useState(true)
  function handleOpen(){
    setOpen((open)=> open === true ? false : true)
  }
  return(
    <div>
     <button onClick={handleOpen}>{open ? "-" : "+"}</button>
     {open && element}
    </div>
  )
 }
 function Open2({element2}){
  const [open, setOpen] = useState(true)
  function handleOpen(){
    setOpen((open)=> open === true ? false : true)
  }
  return (
    <div>
      <button onClick={handleOpen}>{open ? "-" : "+"}</button>
      {open && element2}
    </div>
  );
 }
function Form({query, setQuery, images}){
  return (
    <div className="bg-purple-700 p-3 mr-2 ml-2 border rounded-lg">
      <form className="flex gap-4 justify-center">
        <input
          type="text"
          placeholder="...Search Photo"
          className="bg-purple-400 p-2 text-white border rounded-lg w-7/12 md:w-7/12"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="text-white font-bold">Found Results {images.length}</p>
      </form>
    </div>
  );
}
function Images({images, ondisplayDetails}){
  return(
    <div className='h-fit mt-2'>
{images.map((image)=>(
  <Image key={image.id} image={image} ondisplayDetails={ondisplayDetails}/>
))}
    </div>
  )
}

function Image({image, ondisplayDetails,}){
  return (
    <div
      onClick={() => ondisplayDetails(image.id)}
      className="flex gap-4 border mb-2 mr-2 rounded-lg shadow-lg h-[100px] ml-2 bg-white "
    >
      <img
        src={image.src.original}
        alt={image.alt}
        className="w-[50px] border rounded-lg"
      />
      <p className="font-bold" >{image.alt}</p>
    </div>
  );
}
function ImageDetails({selected, setSelected, onViewImages, viewed}){
const [images, setImages] = useState({})
const [rating, setRating] = useState(0)
const [temp, setTemp] = useState(0)
const [viewerRating, setViewerRating] =useState(rating)

const alreadyViewed = viewed.find((view) => view.id === selected)
const alreadyRated = images.find((image)=>image.id === selected)?.rating

function handleRating(rate) {
  setRating(rate)
  setViewerRating(rate)
}

  useEffect(function(){
    async function displayDetails(){
     const res = await fetch(`https://api.pexels.com/v1/photos/${selected}`,
     {
      headers : {
      Authorization:"MfcgBp0ax9DY23ItLMgQOHpKXUhbbGrcyPlIeNdHVzTqgZhrfPz11Z9P"
      }
     }
    )
     const data= await res.json()
     console.log(data)
     setImages(data)
    }
    displayDetails() 
  }, [selected])

  function handleAddList(){
    const viewList={
      url:images.photographer_url,
      alt:images.alt,
      tiny: images?.src?.tiny,
      id:images.id,
      photographer:images?.photographer,
      userRating: images.viewerRating
    }
    onViewImages(viewList)
    setSelected(null)
  }

  return (
    <div>
      <span>
        <img src={images?.src?.large} className="w-full border rounded-lg" />
        <>
          <p>
            <span className="font-bold">Photographer:</span>{" "}
            {images.photographer}
          </p>
          {!alreadyViewed ? (
            <button onClick={handleAddList}>Add to List</button>
          ) : (
            <p>You already viewed this</p>
          )}
        </>
      </span>
      {selected && (
        <div className="w-fit flex flex- space-y-2">
          { !alreadyViewed ? ( Array.from({ length: 5 }, (_, i) => (
            <StarRating
              key={i}
              full={temp ? temp >= i + 1 : rating >= 1 + i}
              onRating={() => handleRating(i + 1)}
              onHoverEnter={() => setTemp(i + 1)}
              onHoverLeave={() => setTemp(0)}
              temp={temp}
              rating={rating}
              viewerRating={viewerRating}
              setViewerRating={setViewerRating}
            />
          ))):(
           <p> You rated this Pic {alreadyRated}</p>
          )
        }
          <p className="text-lg">{temp || rating || ""}</p>
        </div>
      )}
    </div>
  );
}
function ImagesViewed({viewed, setViewed}){
return (
  <div>
    <div className="bg-[#1e293b] border shadow-lg p-3 text-white rounded-lg">
      Images Seen and Rated : {viewed.length}
    </div>
    {viewed.map((view) => (
      <div key={view.id} className="mt-2 flex w-fit">
        <img
          src={view.tiny}
          alt={view.alt}
          className="w-7/12 border rounded-lg"
        />
        <span>
          <p className='font-bold'>
            Photographer:
            <span>
              <em>{view.photographer}</em>
            </span>
          </p>
          <a href={view.url} className="text-blue-500 text-sm hover:underline">
            Photographed Profile
          </a>
          <p>{viewed.userRating}</p>
        </span>
      </div>
    ))}
  </div>
);
}
 function StarRating({full, onRating, onHoverEnter, viewerRating, onHoverLeave, rating, temp}){
  return (
    <span className='w-[30px] '
    onMouseEnter={onHoverEnter}
    onMouseLeave={onHoverLeave}
    onClick={onRating}
    >
      {full ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="red"
        stroke="blue"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="red"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="{2}"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
      )}  
    </span>
  );
 }