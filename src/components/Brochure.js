import React, { Component } from 'react'
import App from '../App';
import * as awsConstants from './AwsSettings'

// we will get companyId from user profile in next release

class Brochure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brochures: [],
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

            const fileName = this.state.selectedFile.name;

            var lastIndex = fileName.lastIndexOf(".");
            var extension = fileName.substring(lastIndex, fileName.length);

            if(extension != ".pdf") {
                alert("Please upload brochure in pdf format");
                return;
            }

            var filePath = $this.state.companyId + '/BrochuresPDF/brochure' + extension;

            var file = this.state.selectedFile;
            // var filePath = $this.state.companyId + '/Brochures/' + fileName;

            awsConstants.s3.upload({
                Key: filePath,
                Body: file
            }, function (err, data) {
                if (err) {
                    //reject('error');
                    console.error(JSON.stringify(err));

                } else {
                    awsConstants.HideLoading();

                    // add to dynamo db

                    var params =
                    {
                        TableName: "rise_virtual_brochure_cms",
                        Item:
                        {
                            "companyId": $this.state.companyId,
                            "brochureUrl" : filePath,
                            "documentName" : fileName
                        }
                    };
                    
                    var docClient = awsConstants.rise_virtual_license_dynamo;
                    var returnStr = "Error";
                    docClient.put(params, function (err, data) {
                        if (err) {
                            returnStr = "Error: " + JSON.stringify(err, undefined, 2);
                        }
                        else {
                            console.log("Uploaded brochure link.");
                        }
                    });

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
                
                var params =
                {
                    TableName: "rise_virtual_brochure_cms",
                    Item:
                    {
                        "companyId": $this.state.companyId,
                        "brochureUrl" : "",
                        "documentName" : ""
                    }
                };
                
                var docClient = awsConstants.rise_virtual_license_dynamo;
                docClient.put(params, function (err, data) {
                    if (err) {
                        console.log("Error" + JSON.stringify(err, undefined, 2));
                    }
                    else {
                        console.log("Deleted brochure link.");
                    }
                });
                $this.LoadBrochures();
            });
        }
        else {
            return false;
        }
    }

    LoadBrochures = () => {
        const $this = this;
        awsConstants.s3.listObjects({ Prefix: $this.state.companyId + "/BrochuresPDF/" }, function (err, data) {
            if (err) {
                return alert("There was an error viewing your album: " + err.message);
            }
            // 'this' references the AWS.Response instance that represents the response
            var href = this.request.httpRequest.endpoint.href;
            var bucketUrl = href + awsConstants.bucketName + "/";

            var urls = [];

            if(data.Contents.length == 0) {
                $this.setState({ brochures: [] });
            }

            data.Contents.map(function (photo) {
                var mainFolderPath = $this.state.companyId + "/BrochuresPDF/";
                var photoKey = photo.Key;
                var photoUrl = bucketUrl + encodeURIComponent(photoKey);

                if (mainFolderPath == photoKey) {
                    return;
                }

                var documentName = "";

                var params =
                    {
                        TableName: "rise_virtual_brochure_cms",
                        Key:
                        {
                            "companyId": $this.state.companyId,
                        }
                    };

                    var docClient = awsConstants.rise_virtual_license_dynamo;

                    var returnStr = "Error";
                    docClient.get(params, function (err, data) {
                        if (err) {
                            returnStr = "Error:" + JSON.stringify(err, undefined, 2);
                            console.error(returnStr);
                        }
                        else {
                            returnStr = "BrochureLink retrieved: " + JSON.stringify(data, undefined, 2);
                            console.log(returnStr);

                            documentName =  data.Item.documentName
                            urls.push({ key: photoKey, url: documentName });
                            $this.setState({ brochures: urls.map(url => url) });
                        }
                    });

                
            });
            
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

                    {this.state.brochures.map(url => <div key={url.key} className='col-sm-6'>
                        <span>{url.url} </span>
                        <button type="button" className="btn btn-danger" onClick={this.deleteS3Object.bind(this, url.key)}>DELETE</button>
                    </div>
                    )}
                </div>
            </div>
        )
    }
}

export default Brochure
