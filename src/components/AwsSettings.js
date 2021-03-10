import AWS from 'aws-sdk';

var bucketRegion = "eu-west-2";
var identityPoolId = "eu-west-2:f115c8c6-ef3e-4f17-a0d0-5de25f1a3b11";

var urlParams = new URLSearchParams(window.location.search);
export const bucketName = "rise-carousel"

AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId
    })
});

export const s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: { Bucket: bucketName }
});

// we will get companyId from user profile in next release

export const companyId = urlParams.get('companyId');
