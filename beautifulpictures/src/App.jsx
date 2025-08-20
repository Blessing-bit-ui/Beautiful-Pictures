import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Key = "MfcgBp0ax9DY23ItLMgQOHpKXUhbbGrcyPlIeNdHVzTqgZhrfPz11Z9P";

export default function App(){
  const [query, setQuery] = useState("")
  const [images, setImages] =useState([])
  const [selected, setSelected] = useState(null)

  useEffect(function(){
    async function fetchImages(){
      if(!query) return;
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&per_page=10`,
        {
      headers: {
        Authorization: "MfcgBp0ax9DY23ItLMgQOHpKXUhbbGrcyPlIeNdHVzTqgZhrfPz11Z9P"
      }
    }
  )
  const data= await res.json()
      console.log(data.photos)
      setImages(data.photos)
    }
    if(query) fetchImages()
  }, [query])

   function displayDetails(id){
    setSelected(id)
   }
  return (
    <div className="w-11/12">
      <Form query={query} setQuery={setQuery} images={images} />
      <div className="flex">
      <Images
        images={images}
        setImages={setImages}
        ondisplayDetails={displayDetails}
      />
      <ImageDetails selected={selected} setSelected={setSelected} />
    </div>
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
function Images({images,setImages, ondisplayDetails}){
  return(
    <div className='h-fit mt-2'>
{images.map((image)=>(
  <Image key={image.id} image={image} ondisplayDetails={ondisplayDetails}/>
))}
    </div>
  )
}

function Image({image, ondisplayDetails}){
  return (
    <div
      onClick={() => ondisplayDetails(image.id)}
      className="w-[250px] flex gap-4 shadow-lg h-[100px] ml-2"
    >
      <img
        src={image.src.tiny}
        alt={image.alt}
        className="w-[50px] border rounded-lg"
      />
      <p className="font-bold" >{image.alt}</p>
    </div>
  );
}

function ImageDetails({selected, setSelected}){
const [image, setImage] = useState({})
 
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
     setImage(data)
    }
    displayDetails() 
  }, [selected])
  return(
    <div>
    <img src={image.src.original} />  
  <p>{image.photographer}</p>
{selected && <a href={image.photographer_url}>Photographer Profile</a>}
    </div>
  )
}