
import {Cloudinary} from "@cloudinary/url-gen"
//cld-sample-3p

const imgCloud = new Cloudinary({
  cloud:{
    cloudName:'dmjqy7rx4',
    apiKey:'965566542713632',
    apiSecret:'Lkkt3Vc3cHhneTZbeXJSauIKdAw'
  },
  
})
const ImageGallery = () => {

  const getpics = () => {
    fetch("http://localhost:8080/getImagesNames",{method:"GET"}).then(list=>{
      for(uri of list){
        imgCloud.image(uri)
      }
    })
    for uri of 
    imgCloud.image(uri)
  }


	return (
    <div>
      
      <img src={""} height={200} width={200}></img>
      <img src={""} height={200} width={200}></img>
      <img src={""} height={200} width={200}></img>
    </div>
    
	);
};





export default ImageGallery;