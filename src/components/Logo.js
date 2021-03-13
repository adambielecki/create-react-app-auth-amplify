import React, { Component } from 'react'
import * as awsConstants from './AwsSettings'

// we will get companyId from user profile in next release

class Logo extends Component {
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

    uploadLogo = () => {
        if (this.state.selectedFile) {
            const $this = this;
            const fileName = this.state.selectedFile.name;

            var lastIndex = fileName.lastIndexOf(".");
            var extension = fileName.substring(lastIndex, fileName.length);
            var filePath = awsConstants.cmsInfo.companyId + '/Logo/logo' + extension;

            awsConstants.s3.upload({
                Key: filePath,
                Body: this.state.selectedFile
            }, function (err, data) {
                if (err) {
                    //reject('error');
                    console.error(JSON.stringify(err));

                } else {
                    awsConstants.HideLoading()
                    $this.LoadLogo();
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
                $this.LoadLogo();
            });
        }
        else {
            return false;
        }
    }

    LoadLogo = () => {
        const $this = this;
        const folderPath = awsConstants.cmsInfo.companyId + "/Logo/";
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

    componentDidMount() {
        this.LoadLogo();
    }
    render() {
        return (
            <div>
                <div className="col-sm-3">
                <div className="input-group mb-3">
                        <input onChange={this.onFileChange} type="file" className="form-control" aria-label="Upload"/>
                        <button onClick={this.uploadLogo} className="btn btn-outline-secondary" type="button">Upload</button>
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

export default Logo
