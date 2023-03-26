import FileButton from "../components/FileButton"
import ImageComponent from "../components/ImageComponent";
import "./HomePage.css"
function HomePage() {
    return (
      <div className="HomePage" >

        <div className="App-header">
            <a> headline</a>
            <p> this is the text you would see.</p>  
        </div>

          <div className="Grid-page">
            <ImageComponent></ImageComponent>

          </div>
          <FileButton></FileButton>


      </div>
    );
  }
  
  export default HomePage;