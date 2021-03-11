import React from 'react'
import AWS from 'aws-sdk';
import Brochure from './Brochure'
import Logo from './Logo'
import Video from './Videos'

import { render } from 'react-dom';

var bucketName = "rise-carousel";
var bucketRegion = "eu-west-2";
var identityPoolId = "eu-west-2:f115c8c6-ef3e-4f17-a0d0-5de25f1a3b11";

var urlParams = new URLSearchParams(window.location.search);

// we will get companyId from user profile in next release
var companyId = urlParams.get('companyId');

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId
  })
});

var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: bucketName }
});

// function EventListeners()
// {

//     document.getElementById('photoupload').addEventListener('change', () => {
//         const input = document.getElementById('photoupload').files[0];
//         uploadCarouselImage(input);
//       });
      
//       document.getElementById('videoupload').addEventListener('change', () => {
//         var input = document.getElementById('videoupload').files[0];
//         uploadVideo(input);
//       });
      
      
//       document.getElementById('logoupload').addEventListener('change', () => {
//         var input = document.getElementById('logoupload').files[0];
//         uploadLogo(input);
//       });
// }


// function uploadVideo(file) {

//   console.log(file);
//   var fileName = file.name;
//   var filePath = companyId + '/Videos/' + fileName;

//   s3.upload({
//     Key: filePath,
//     Body: file
//   }, function (err, data) {
//     if (err) {
//       //reject('error');
//       console.error(JSON.stringify(err));

//     } else {
//       alert('Successfully Uploaded!');
//       document.getElementById("uploading").style.display = "none";

//       viewMovies(companyId);
//     }

//   }).on('httpUploadProgress', function (progress) {
//     document.getElementById("uploading").style.display = "block";
//     var uploaded = parseInt((progress.loaded * 100) / progress.total);
//     document.getElementById("percentValue").innerHTML = uploaded;
//     //$("progress").attr('value', uploaded);
//     console.log(progress);
//   });
// };

function uploadCarouselImage(file) {

  console.log(file);
  var fileName = file.name;
  var filePath = companyId + '/Carousel/' + fileName;

  s3.upload({
    Key: filePath,
    Body: file
  }, function (err, data) {
    if (err) {
      //reject('error');
      console.error(JSON.stringify(err));

    } else {
      alert('Successfully Uploaded!');
      viewCarousel(companyId);
    }

  }).on('httpUploadProgress', function (progress) {
    //var uploaded = parseInt((progress.loaded * 100) / progress.total);
    //$("progress").attr('value', uploaded);
    console.log(progress);
  });
};

function getHtml(template) {
  return template.join('\n');
}

// get image data
function setImageCorrectRatio(url, elementId){   
  var img = new Image();
  img.onload = function(){
    // 90 is default height of the element, so make sure we have correct aspect ratio
     document.getElementById(elementId).width = (this.width) / (this.height / 90);
  };
  img.src = url;
}


function viewCarousel(albumName) {
  var albumPhotosKey = encodeURIComponent(albumName);
  s3.listObjects({ Prefix: albumName + "/Carousel/" }, function (err, data) {
    if (err) {
      return alert("There was an error viewing your album: " + err.message);
    }
    // 'this' references the AWS.Response instance that represents the response
    var href = this.request.httpRequest.endpoint.href;
    var bucketUrl = href + bucketName + "/";

    var photos = data.Contents.map(function (photo) {
      var mainFolderPath = companyId + "/Carousel/";
      var photoKey = photo.Key;
      var photoUrl = bucketUrl + encodeURIComponent(photoKey);

      if (mainFolderPath == photoKey) {
        return;
      }

      return getHtml([
        "<div class='col-sm-3'>",
        "<div>",
        '<img height=90 width=160 src="' + photoUrl + '"/>',
        "</div>",
        "<div >",
        "<span onclick=\"deletePhoto('" +
        albumName +
        "','" +
        photoKey +
        "')\">",
        "DELETE",
        "</span>",
        "<span>",
        photoKey.replace(albumPhotosKey, ""),
        "</span>",
        "</div>",
        "</div>"
      ]);
    });
    var message = photos.length
      ? "<p>Click DELETE under photo to remove it from carousel.</p>"
      : "<p>You do not have any images.</p>";
    var htmlTemplate = [
      message,
      "<div class='row'>",
      getHtml(photos),
      "</div>",
    ];
    document.getElementById("carousel-images").innerHTML = getHtml(htmlTemplate);
  });
}


function deletePhoto(albumName, photoKey) {
const message = "Are you sure?";
  if (window.confirm(message)) {
    s3.deleteObject({ Key: photoKey }, function (err, data) {
      if (err) {
        return alert("There was an error deleting your photo: ", err.message);
      }
      alert("Successfully deleted photo.");
      viewCarousel(albumName);
    });
  }
  else {
    return false;
  }
}


if (companyId) {
  viewCarousel(companyId);
}

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
                            <input className="form-control form-control-lg" id="photoupload" type="file" accept="image/*.jpg" />
                            <h4>Currently uploaded images for carousel</h4>
                            <div id="carousel-images"></div>
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
                        <h5>Please add video in mp4 format. Recommended ratio 16:9.</h5>
                          
                            <Video/>
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
                        <h5>Please add image in jpg format. Recommended ratio 16:9.</h5>
                  
                            <h6 className="mt-3 mb-3">Presentation 1</h6>

                        <Brochure number="1" />
                            <h6 className="mt-3 mb-3">Presentation 2</h6>
                            
                        <Brochure number="2" />
                        
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
                            <h5>Upload your company logo. Accepted formats (jpg,png)</h5>

                                <Logo />
                        </div>
                    </div>

                </div>
            </div>
    )
}