import React, { Component, useState, useEffect } from 'react';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
import Accordion from './components/Accordion';
import * as awsConstants from './components/AwsSettings'
import AWS from 'aws-sdk';

Amplify.configure(aws_exports);

export function App() {

  const [userSession, setSession] = useState();

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

      var returnStr = "Error";

      var docClient = new AWS.DynamoDB.DocumentClient();
      docClient.get(params, function (err, data) {
        if (err) {
          returnStr = "Error:" + JSON.stringify(err, undefined, 2);
        }
        else {
          returnStr = "Data Found:" + JSON.stringify(data, undefined, 2);
          setSession(data.Item);
          awsConstants.cmsInfo.companyId = data.Item.licenses[0];
          console.log("Setup in App " + awsConstants.cmsInfo.companyId);
          
        }
      });

    })
  }, []);

  return (
    <div >
      {userSession && <Accordion userSession={userSession}/>}

    </div>

  );
}

export default withAuthenticator(App, true);
