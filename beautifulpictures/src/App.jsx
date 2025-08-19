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
        `https://api.pexels.com/v1/search?query=${query}`,
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
  return(
    <div>
      <Form query={query} setQuery={setQuery}/>
      <Images images={images} setImages={setImages} ondisplayDetails={displayDetails}/>
      <ImageDetails selected={selected} setSelected={setSelected} />
    </div>
  )
}

function Form({query, setQuery}){
  return(
    <div>
      <input
      type="text"
      placeholder='...Search Photo'
      value={query}
      onChange={(e)=>setQuery(e.target.value)}
      />
    </div>
  )
}
function Images({images,setImages, ondisplayDetails}){
  return(
    <div>
{images.map((image)=>(
  <Image key={image.id} image={image} ondisplayDetails={ondisplayDetails}/>
))}
    </div>
  )
}

function Image({image, ondisplayDetails}){
  return(
    <div onClick={()=>ondisplayDetails(image.id)}>
     <img src={image.src.small} 
     alt={image.alt}
     className='w-[100px]'
     />
     <p>{image.photographer}</p>
    </div>
  )
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
  <p>{image.photographer}</p>
    </div>
  )
}