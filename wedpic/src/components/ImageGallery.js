
const ImageGallery = () => {


  const getpics = () => {
    fetch("http://localhost:8080/getImages",{method:"GET"}).then(list=>{
      
    })
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