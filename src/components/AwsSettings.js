import AWS from 'aws-sdk';

var bucketRegion = "eu-west-2";
var identityPoolId = "eu-west-2:f115c8c6-ef3e-4f17-a0d0-5de25f1a3b11";

// var urlParams = new URLSearchParams(window.location.search);

AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId
    })
});

export let userSession = "";

export const bucketName = "rise-carousel"

export const s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: { Bucket: bucketName }
});

export const rise_virtual_license_dynamo = new AWS.DynamoDB.DocumentClient();

// we will get companyId from user profile in next release


// export const companyId = urlParams.get('companyId');

export let cmsInfo = {};

Object.defineProperty(cmsInfo, "companyId", {
    value: "",
    writable: true
})



// Object.defineProperty("companyId", {
//     get: function() {
//         return companyId;
//     },
//     set: function(value) {
//         companyId = value;
//     }
// })

export function ShowLoading(progress) {
    document.getElementById("uploading").style.display = "block";
    var uploaded = parseInt((progress.loaded * 100) / progress.total);
    document.getElementById("percentValue").innerHTML = uploaded;
}

export function HideLoading() {
    document.getElementById("uploading").style.display = "none";
}

export function GetFileExtension(fileName) {
    var lastIndex = fileName.lastIndexOf(".");
    return fileName.substring(lastIndex, fileName.length).toLowerCase();
}
