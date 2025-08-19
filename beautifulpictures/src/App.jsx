import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Key = "MfcgBp0ax9DY23ItLMgQOHpKXUhbbGrcyPlIeNdHVzTqgZhrfPz11Z9P";

export default function App(){
  const [query, setQuery] = useState("")
  const [images, setImages] =useState([])

  useEffect(function(){
    async function fetchImages(){
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&per_page=1`,
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

  return(
    <div>
      <Form query={query} setQuery={setQuery}/>
      <Images images={images} setImages={setImages}/>
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
function Images({images,setImages}){
  return(
    <div>
{images.map((image)=>(
  <Image key={image.id} image={image} />
))}
    </div>
  )
}

function Image({image}){
  return(
    <div>
{}
    </div>
  )
}