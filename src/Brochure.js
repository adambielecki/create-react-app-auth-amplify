import React, { Component } from 'react'
import AWS from 'aws-sdk';

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


// get brochureName from props
const brochureName = 1;
class Brochure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brochures: []
        };
        var albumPhotosKey = encodeURIComponent(companyId);
    }

    componentDidMount() {
        const $this = this;
        s3.listObjects({ Prefix: companyId + "/Brochures/" + brochureName + "/" }, function (err, data) {
            if (err) {
                return alert("There was an error viewing your album: " + err.message);
            }
            // 'this' references the AWS.Response instance that represents the response
            var href = this.request.httpRequest.endpoint.href;
            var bucketUrl = href + bucketName + "/";

            var urls = [];
            data.Contents.map(function (photo) {
                var mainFolderPath = companyId + "/Brochures/";
                var photoKey = photo.Key;
                var photoUrl = bucketUrl + encodeURIComponent(photoKey);

                if (mainFolderPath == photoKey) {
                    return;
                }

                urls.push(photoUrl);
            });
            $this.setState( {brochures : urls.map(url => url)});
        });
    }
    render() {
        return (
            <div class='col-sm-3'>
                    {this.state.brochures.map(url => <img height='90' width='160' src={url}/> )}  
            </div>
        )
    }
}

export default Brochure

// export default function viewBrochure(albumName, brochureName) {
//     var albumPhotosKey = encodeURIComponent(albumName);
//     s3.listObjects({ Prefix: albumName + "/Brochures/" + brochureName + "/" }, function (err, data) {
//         if (err) {
//             return alert("There was an error viewing your album: " + err.message);
//         }
//         // 'this' references the AWS.Response instance that represents the response
//         var href = this.request.httpRequest.endpoint.href;
//         var bucketUrl = href + bucketName + "/";

//         var photos = data.Contents.map(function (photo) {
//             var mainFolderPath = companyId + "/Brochures/";
//             var photoKey = photo.Key;
//             var photoUrl = bucketUrl + encodeURIComponent(photoKey);

//             if (mainFolderPath == photoKey) {
//                 return;
//             }

//             // return getHtml([
//             //   "<div class='col-sm-3'>",
//             //   "<div>",
//             //   '<img height=90 width=160 src="' + photoUrl + '"/>',
//             //   "</div>",
//             //  "</div>"
//             // ]);

//             //GenerateImage(photoUrl);

//         });

//         var htmlTemplate = [
//             "<div class='row'>",
//             photos,
//             "</div>",
//         ];

//         document.getElementById("brochures_" + brochureName).innerHTML = getHtml(htmlTemplate);
//     });
// }