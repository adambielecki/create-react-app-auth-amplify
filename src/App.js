import React, { Component, useState, useEffect } from 'react';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
import Accordion from './components/Accordion';
import * as awsConstants from './components/AwsSettings'
import AWS from 'aws-sdk';

Amplify.configure(aws_exports);

// getCmsSetupInfo = () => {
//   return;
// }

export function App() {

  const [userSession, setSession] = useState();
  const [cmsInfo, setCmsInfo] = useState();


  useEffect(() => {
    var userInfoPromise = Promise.resolve(Auth.currentUserInfo());

    userInfoPromise.then(result => {

      console.log(result.attributes.email);

      var params =
      {
        TableName: "rise_cms",
        Key:
        {
          "user_id": result.attributes.email
        }
      };


      var docClient = new AWS.DynamoDB.DocumentClient();
      docClient.get(params, function (err, data) {
        if (err) {
          console.error("Error getting rise_cms user data " +  err);
        }
        else {
          setSession(data.Item);
          awsConstants.cmsInfo.companyId = data.Item.licenses[0];
          console.log("Setup in App " + awsConstants.cmsInfo.companyId);

          // get restriction info for sections

          params =
          {
            TableName: "rise_virtual_licensing",
            Key:
            {
              "companyId": awsConstants.cmsInfo.companyId
            }
          };

          docClient.get(params, function (err, data) {
            if (err) {
              console.error("Error getting rise_virtual_licensing cms info" +  err);

            }
            else {
              setCmsInfo(data.Item);
              console.log("Cms info results " + JSON.stringify(data.Item.cms));
            }

          });
        }
      });

    })
  }, []);

  return (
    <div >
      {userSession && cmsInfo && <Accordion userSession={userSession} cmsInfo={cmsInfo} />}

    </div>

  );
}

export default withAuthenticator(App, true);
