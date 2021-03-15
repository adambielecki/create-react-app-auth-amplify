import React, { Component } from 'react'

class UserAction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
        console.log("User actions " + JSON.stringify(props.callToActionResults));
    }


    render() {
        return <table class="table">
        <thead>
          <tr>
            <th scope="col">Requested at</th>
            <th scope="col">First name</th>
            <th scope="col">Last name</th>
            <th scope="col">E-mail</th>
            <th scope="col">Contact date</th>
          </tr>
        </thead>
        <tbody>
        {this.props.callToActionResults.map(userAction => 
          <tr key={userAction.dateTime}>
            <th>{userAction.dateTime}</th>
            <td>{userAction.firstName}</td>
            <td>{userAction.lastName}</td>
            <td>{userAction.email}</td>
            <td>{userAction.contactDate} - {userAction.contactTime}</td>
          </tr>
        )
    }
          
        </tbody>
      </table>
    }
}

export default UserAction