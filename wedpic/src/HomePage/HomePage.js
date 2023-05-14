import FileButton from "../components/FileButton";
import ImageGallery from "../components/ImageGallery";
import ImageComponent from "../components/ImageComponent";
import "./HomePage.css";
function HomePage() {
  return (
    
    <div className="HomePage">
      
        <div className="squarediv">
        <div class="container">
          <img id="image1" class="image" />
          <img id="image2" class="image"  />
          <img id="image3" class="image"  />

  </div>
          <div className="App-header">
            <a className="headlinestyle"> ברוכים הבאים
לחתונה של
ישי ובר</a>
            <div className="thanksstyle">איזה  כיף  שבאתם</div>
            <div className="explainingviv">
           
            </div>
          </div>
     
      </div>

      <div className="Grid-page">
        <ImageComponent></ImageComponent>
      </div>
      <FileButton></FileButton>
      <footer className="foterstyle">wedpic</footer>
    </div>
  );
}

export default HomePage;
