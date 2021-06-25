import React, { Component } from 'react'
import * as awsConstants from './AwsSettings'

// we will get companyId from user profile in next release

class PresentationHtmlLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
            presentationLink: '',
            companyId: props.userSession.licenses[0],
        };

        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.saveHtmlFile = this.saveHtmlFile.bind(this);
    }

    onFileChange = ev => {
        this.setState({ selectedFile: ev.target.files[0] });
    }

    uploadCarousel = () => {

        if (this.state.images.length >= this.state.carouselImagesMax) {
            alert("You exceeded your upload limit.");
            return;
        }

        if (this.state.selectedFile) {
            const $this = this;
            const fileName = this.state.selectedFile.name;

            console.log(awsConstants.GetFileExtension(fileName));
            if (awsConstants.GetFileExtension(fileName) !== ".jpg") {
                alert("Please upload image in jpg format.")
                return;
            }

            var filePath = $this.state.companyId + '/Carousel/' + fileName;

            awsConstants.s3.upload({
                Key: filePath,
                Body: this.state.selectedFile
            }, function (err, data) {
                if (err) {
                    //reject('error');
                    console.error(JSON.stringify(err));

                } else {
                    awsConstants.HideLoading()
                    $this.LoadCarousel();
                }

            }).on('httpUploadProgress', function (progress) {

                awsConstants.ShowLoading(progress);
                console.log(progress);
            });
        };
    }

    LoadCarousel = () => {
        const $this = this;
        const folderPath = $this.state.companyId + "/Carousel/";
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
            $this.setState({ images: urls.map(url => url) });
        });
    }

    componentDidMount() {
        //this.LoadCarousel();
        this.loadHtmlUrl();

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
                $this.LoadCarousel();
            });
        }
        else {
            return false;
        }
    }

    loadHtmlUrl = () => {
        // call aws dynamo to load saved link
        var $this = this;
        var params =
            {
                TableName: "rise_virtual_cms_info",
                Key:
                {
                    "companyId": this.state.companyId,
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
                    returnStr = "Link retrieved: " + JSON.stringify(data, undefined, 2);
                    console.log(returnStr);

                    if(data.Item) {
                        $this.setState({
                            "presentationLink": data.Item.presentationLink
                        });
                    }
                }
            });
    }

    saveHtmlFile = () => {
        console.log(this.state.presentationLink);
        console.log(this.state);

        var params =
            {
                TableName: "rise_virtual_cms_info",
                Item:
                {
                    "companyId": this.state.companyId,
                    "presentationLink" : this.state.presentationLink
                }
            };
            
            var docClient = awsConstants.rise_virtual_license_dynamo;
            var returnStr = "Error";
            docClient.put(params, function (err, data) {
                if (err) {
                    returnStr = "Error: " + JSON.stringify(err, undefined, 2);
                }
                else {
                    console.log("Uploaded presentation html link.");
                }
            });
    }

    handleUrlChange({ target }) {
        console.log(target);
        this.setState({
            [target.name]: target.value
        });
    }

    render() {
        return (
            <div key={this.state.license}>
                <div className="col-sm-6">
                    <div className="input-group mb-3">
                        <input type="text" name="presentationLink" value={this.state.presentationLink} onChange={this.handleUrlChange} className="form-control" aria-label="Upload" />
                        <button onClick={this.saveHtmlFile} className="btn btn-outline-secondary" type="button">Save</button>
                    </div>
                </div>

            </div>
        )
    }
}

export default PresentationHtmlLink
