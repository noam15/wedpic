import FileButton from "../components/FileButton"
import ImageGallery from "../components/ImageGallery"
import ImageComponent from "../components/ImageComponent";
import "./HomePage.css"
function HomePage() {
    return (
      <div className="HomePage" >

        <div className="App-header">
            <a className="headlinestyle"> בר & ישי</a>
            <p >17.5.2023</p> 
            <p> this is the text you would see.</p>  
        </div>

          <div className="Grid-page">
            
            <ImageComponent></ImageComponent>
            <ImageGallery></ImageGallery>

          </div>
          <FileButton></FileButton>


      </div>
    );
  }
  
  export default HomePage;