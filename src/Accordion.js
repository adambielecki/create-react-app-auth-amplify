import React from 'react'

export default function Accordion() {
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
                        <h5>Please add image in jpg format. Recommended ratio 16:9.</h5>
                        <p>
                            <input className="form-control form-control-lg" id="photoupload" type="file" accept="image/*.jpg" />
                            <h4>Currently uploaded images for carousel</h4>
                            <div id="carousel-images"></div>
                        </p>
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
                <div id="collapseTwo" className="accordion-collapse" aria-labelledby="videos-accordion"
                    data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                        <h5>Please add video in mp4 format. Recommended ratio 16:9.</h5>
                        <p>
                            <input className="form-control form-control-lg" id="videoupload" type="file" accept="video/*.mp4" />
                            <h4>Currently uploaded movies</h4>
                            <div id="videos"></div>
                        </p>
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
                <div id="collapseThree" className="accordion-collapse" aria-labelledby="presentation-accordion"
                    data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                        <h5>Please add image in jpg format. Recommended ratio 16:9.</h5>
                        <p>
                            <h6>Presentation 1</h6>

                            <input className="form-control form-control-lg" id="brochureupload_1" type="file" accept="image/*.jpg" />
                            <h4>Currently uploaded</h4>
                            <div id="brochures_1"></div>
                        </p>
                        <p>
                            <h6>Presentation 2</h6>
                            <input className="form-control form-control-lg" id="brochureupload_2" type="file" accept="image/*.jpg" />
                            <h4>Currently uploaded</h4>
                            <div id="brochures_2"></div>
                        </p>
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
                    <div id="logo" className="accordion-collapse" aria-labelledby="logo-accordion"
                        data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <h5>Upload your company logo. Accepted formats (jpg,png)</h5>
                            <p>
                                <input className="form-control form-control-lg" id="logoupload" type="file" />
                                <h4>Currently uploaded logo</h4>
                                <div id="logo-section"></div>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
    )
}