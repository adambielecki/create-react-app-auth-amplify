import React, { Component, useState, useEffect } from 'react';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
import Accordion from './components/Accordion';
import * as awsConstants from './components/AwsSettings'
import UserAction from './components/UserAction'

import AWS from 'aws-sdk';

Amplify.configure(aws_exports);

// getCmsSetupInfo = () => {
//   return;
// }

export function App() {

  const [userSession, setSession] = useState();
  const [cmsInfo, setCmsInfo] = useState();
  const [callToActionResults, setCallToAction] = useState();
  const [userUnityActions, setUserUnityActions] = useState();

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
              console.log("Cms info results " + JSON.stringify(data.Item));
            }

          });

          // get user call to action data

          var params =
          {
            TableName: "rise_virtual_cta",
            FilterExpression: 'companyId = :a',
            ExpressionAttributeValues: {
              ":a": awsConstants.cmsInfo.companyId
          }
          };

          docClient.scan(params, function (err, data) {
            if (err) {
              console.error("Error getting rise_virtual_cta cms info" +  err);

            }
            else {
              if(data) {
                console.log("Call to action info results " + JSON.stringify(data.Items));
                setCallToAction(data.Items);
              } else {
                console.log("No results for rise_virtual_cta")
              }
            }

          });

          var params =
          {
            TableName: "rise_virtual_unity_actions",
            FilterExpression: 'companyId = :a',
            ExpressionAttributeValues: {
              ":a": awsConstants.cmsInfo.companyId
          }
         
          };

          docClient.scan(params, function (err, data) {
            if (err) {
              console.error("Error getting rise_virtual_unity_actions cms info" +  err);

            }
            else {
              if(data) {
                console.log("Call to action info results " + JSON.stringify(data.Items));
                setUserUnityActions(data.Items);
              } else {
                console.log("No results for rise_virtual_unity_actions")
              }
            }

          });

        }
      });

    })
  }, []);

  return (
    <div className="container">
      {userSession && cmsInfo && <Accordion userSession={userSession} cmsInfo={cmsInfo} />}

      <h2 className="display-5 p-3">User engagement data</h2>
      {callToActionResults && userUnityActions && <UserAction callToActionResults={callToActionResults} userUnityActions={userUnityActions}/>}

    </div>

  );
}

export default withAuthenticator(App, true);
