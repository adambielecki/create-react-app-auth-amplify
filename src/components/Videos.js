import React, { Component } from 'react'
import * as awsConstants from './AwsSettings'
import VideoThumbnail from 'react-video-thumbnail'; // use npm published version
import { render } from 'react-dom';


// we will get companyId from user profile in next release

class Video extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brochures: [],
            brochureNumber: props.number,
            selectedFile: null
        };
    }

    onFileChange = ev => {
        this.setState({ selectedFile: ev.target.files[0] });
    }

    uploadVideo = () => {
        if (this.state.selectedFile) {
            const $this = this;
            const fileName = this.state.selectedFile.name;

            console.log(awsConstants.GetFileExtension(fileName));
            if(awsConstants.GetFileExtension(fileName) !== ".mp4") {
                alert("Please upload video in mp4 format.")
                return;
            }

            var filePath = awsConstants.companyId + '/Videos/' + fileName;

            awsConstants.s3.upload({
                Key: filePath,
                Body: this.state.selectedFile
            }, function (err, data) {
                if (err) {
                    //reject('error');
                    console.error(JSON.stringify(err));

                } else {
                    awsConstants.HideLoading()
                    $this.LoadVideos();
                }

            }).on('httpUploadProgress', function (progress) {
                
                awsConstants.ShowLoading(progress);
                console.log(progress);
            });
        };
    }

    LoadVideos = () => {
        const $this = this;
        const folderPath = awsConstants.companyId + "/Videos/";
        awsConstants.s3.listObjects({ Prefix: folderPath }, function (err, data) {
            if (err) {
                return alert("There was an error viewing your album: " + err.message);
            }
            // 'this' references the AWS.Response instance that represents the response
            var href = this.request.httpRequest.endpoint.href;
            var bucketUrl = href + awsConstants.bucketName + "/";

            var urls = [];
            data.Contents.map(function (photo) {
                var photoKey = photo.Key;
                var photoUrl = bucketUrl + encodeURIComponent(photoKey);

                if (folderPath == photoKey) {
                    return;
                }

                urls.push({ key: photoKey, url: photoUrl });
            });
            $this.setState({ brochures: urls.map(url => url) });
        });
    }

     RenderImage = (url) => {
        return <VideoThumbnail
    videoUrl={url}
    thumbnailHandler={(thumbnail) => console.log(thumbnail)}
    width={290}
    height={165}
    cors={false}
    />
    }

    componentDidMount() {
        this.LoadVideos();
        
    }

    deleteS3Object = (key) => {
        const $this = this;
        var dialogOutput = window.confirm("Are you sure?");

        if (dialogOutput == true) {
            awsConstants.s3.deleteObject({ Key: key }, function (err, data) {
                if (err) {
                    return alert("There was an error deleting your photo: ", err.message);
                }
                //alert("Successfully deleted photo.");
                $this.LoadVideos();
            });
        }
        else {
            return false;
        }
    }

    render() {
        return (
            <div>
                <div className="col-sm-3">
                <div className="input-group mb-3">
                        <input onChange={this.onFileChange} type="file" className="form-control" aria-label="Upload"/>
                        <button onClick={this.uploadVideo} className="btn btn-outline-secondary" type="button">Upload</button>
                </div>
                </div>
                
                <div className="row">

                    {this.state.brochures.map(url => 
                    
                    <div key={url.key} className='col-sm-2'>
                        <div className="img-fluid" style={{height:165}}>{this.RenderImage(url.url)}</div>
                        <button type="button" className="btn btn-danger" onClick={this.deleteS3Object.bind(this, url.key)}>DELETE</button>
                    </div>
                    )}
                </div>
            </div>
        )
    }
}

export default Video
