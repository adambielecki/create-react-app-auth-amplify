import React, { Component } from 'react'
import Brochure from './Brochure'
import Logo from './Logo'
import Video from './Videos'
import Carousel from './Carousel'
import * as awsConstants from './AwsSettings'

// get image data
function setImageCorrectRatio(url, elementId) {
  var img = new Image();
  img.onload = function () {
    // 90 is default height of the element, so make sure we have correct aspect ratio
    document.getElementById(elementId).width = (this.width) / (this.height / 90);
  };
  img.src = url;
}

class Accordion extends Component {

  constructor(props) {
    super(props);
    this.state = {
        
    };
    
}

render() {
  return (
    <div className="accordion" id="accordionExample">
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingOne">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
            aria-expanded="false" aria-controls="collapseOne">
            Upload images for Carousel
          </button>
        </h2>
        <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne"
          data-bs-parent="#accordionExample">
          <div className="accordion-body">
            <p className="fs-3">Please add image in jpg format. Recommended ratio 16:9.</p>
         
            <Carousel userSession={this.props.userSession}/>
          </div>
        </div>

      </div>
      <div className="accordion-item">
        <h2 className="accordion-header" id="videos-accordion">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo"
            aria-expanded="false" aria-controls="collapseTwo">
            Upload videos
          </button>
        </h2>
        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="videos-accordion"
          data-bs-parent="#accordionExample">
          <div className="accordion-body">
            <p className="fs-3">Please add video in mp4 format. Recommended ratio 16:9.</p>

            <Video userSession={this.props.userSession}/>
          </div>
        </div>

      </div>
      <div className="accordion-item">
        <h2 className="accordion-header" id="presentation-accordion">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree"
            aria-expanded="false" aria-controls="collapseThree">
            Upload presentation images
          </button>
        </h2>
        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="presentation-accordion"
          data-bs-parent="#accordionExample">
          <div className="accordion-body">
            <p className="fs-3">Please add image in jpg format. Recommended ratio 16:9.</p>

            <h6 className="mt-3 mb-3">Presentation 1</h6>

            <Brochure number="1" userSession={this.props.userSession} />
            <h6 className="mt-3 mb-3">Presentation 2</h6>

            <Brochure number="2" userSession={this.props.userSession} />

          </div>

        </div>
      </div>
      <div className="accordion-item">
        <h2 className="accordion-header" id="logo-accordion">
          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#logo"
            aria-expanded="false" aria-controls="logo">
            Upload your company logo.
          </button>
        </h2>
        <div id="logo" className="accordion-collapse collapse" aria-labelledby="logo-accordion"
          data-bs-parent="#accordionExample">
          <div className="accordion-body">
            <p className="fs-3">Upload your company logo. Accepted formats (jpg,png)</p>

            <Logo userSession={this.props.userSession}/>
          </div>
        </div>

      </div>
    </div>
  )
}
  
}

export default Accordion