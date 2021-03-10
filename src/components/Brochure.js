import React, { Component } from 'react'
import * as awsConstants from './AwsSettings'

// we will get companyId from user profile in next release

class Brochure extends Component {
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

    uploadBrochure = () => {
        if (this.state.selectedFile) {
            const $this = this;

            var file = this.state.selectedFile;
            var fileName = file.name;
            var filePath = awsConstants.companyId + '/Brochures/' + $this.state.brochureNumber + "/" + fileName;

            awsConstants.s3.upload({
                Key: filePath,
                Body: file
            }, function (err, data) {
                if (err) {
                    //reject('error');
                    console.error(JSON.stringify(err));

                } else {
                    //document.getElementById("uploading").style.display = "none";

                    $this.LoadBrochures();
                }

            }).on('httpUploadProgress', function (progress) {
                //document.getElementById("uploading").style.display = "block";
                var uploaded = parseInt((progress.loaded * 100) / progress.total);
                //document.getElementById("percentValue").innerHTML = uploaded;
                //$("progress").attr('value', uploaded);
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
        awsConstants.s3.listObjects({ Prefix: awsConstants.companyId + "/Brochures/" + $this.state.brochureNumber + "/" }, function (err, data) {
            if (err) {
                return alert("There was an error viewing your album: " + err.message);
            }
            // 'this' references the AWS.Response instance that represents the response
            var href = this.request.httpRequest.endpoint.href;
            var bucketUrl = href + awsConstants.bucketName + "/";

            var urls = [];
            data.Contents.map(function (photo) {
                var mainFolderPath = awsConstants.companyId + "/Brochures/";
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

                <div className="input-group sm-3">
                    <div className="custom-file">
                        <input onChange={this.onFileChange} type="file" className="custom-file-input" id="inputGroupFile04" />
                        <label className="custom-file-label" htmlFor="inputGroupFile04">Choose file</label>
                    </div>
                    <div className="input-group-append">
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
