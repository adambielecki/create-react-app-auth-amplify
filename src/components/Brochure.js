import React, { Component } from 'react'
import App from '../App';
import * as awsConstants from './AwsSettings'

// we will get companyId from user profile in next release

class Brochure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brochures: [],
            brochureNumber: props.number,
            selectedFile: null,
            companyId: props.userSession.licenses[0]
        };

        
    }

    onFileChange = ev => {
        this.setState({ selectedFile: ev.target.files[0] });
    }

    uploadBrochure = () => {
        if (this.state.selectedFile) {
            const $this = this;

            var file = this.state.selectedFile;
            var fileName = file.name;
            var filePath = $this.state.companyId + '/Brochures/' + $this.state.brochureNumber + "/" + fileName;

            awsConstants.s3.upload({
                Key: filePath,
                Body: file
            }, function (err, data) {
                if (err) {
                    //reject('error');
                    console.error(JSON.stringify(err));

                } else {
                    awsConstants.HideLoading()
                    $this.LoadBrochures();
                }

            }).on('httpUploadProgress', function (progress) {
                
                awsConstants.ShowLoading(progress);
                console.log(progress);
            });
        };
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
                $this.LoadBrochures();
            });
        }
        else {
            return false;
        }
    }

    LoadBrochures = () => {
        const $this = this;
        awsConstants.s3.listObjects({ Prefix: $this.state.companyId + "/Brochures/" + $this.state.brochureNumber + "/" }, function (err, data) {
            if (err) {
                return alert("There was an error viewing your album: " + err.message);
            }
            // 'this' references the AWS.Response instance that represents the response
            var href = this.request.httpRequest.endpoint.href;
            var bucketUrl = href + awsConstants.bucketName + "/";

            var urls = [];
            data.Contents.map(function (photo) {
                var mainFolderPath = $this.state.companyId + "/Brochures/";
                var photoKey = photo.Key;
                var photoUrl = bucketUrl + encodeURIComponent(photoKey);

                if (mainFolderPath == photoKey) {
                    return;
                }

                urls.push({ key: photoKey, url: photoUrl });
            });
            $this.setState({ brochures: urls.map(url => url) });
        });
    }

    componentDidMount() {
        this.LoadBrochures();
    }
    
    render() {
        return (
            <div>
                <div className="col-sm-3">
                <div className="input-group mb-3">
                        <input onChange={this.onFileChange} type="file" className="form-control" aria-label="Upload"/>
                        <button onClick={this.uploadBrochure} className="btn btn-outline-secondary" type="button">Upload</button>
                </div>
                </div>
                
                <div className="row">

                    {this.state.brochures.map(url => <div key={url.key} className='col-sm-2'>
                        <img className="img-fluid" src={url.url} />
                        <button type="button" className="btn btn-danger" onClick={this.deleteS3Object.bind(this, url.key)}>DELETE</button>
                    </div>
                    )}
                </div>
            </div>
        )
    }
}

export default Brochure
