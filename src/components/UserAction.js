import React, { Component } from 'react'
import DataTable from 'react-data-table-component'

const columns = [
    {
      name: "Requested at",
      selector: "dateTime",
      sortable: false
    },
    {
      name: "First name",
      selector: "firstName",
      sortable: true
    },
    {
        name: "Last name",
        selector: "lastName",
        sortable: true
      },
    {
      name: "E-mail",
      selector: "email",
      sortable: true
    },
    {
        name: "Contact date",
        selector: "contactDate",
        sortable: true
    },
    {
        name: "Contact time",
        selector: "contactTime",
        sortable: true
    }
  ];

class UserAction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
        console.log("User actions " + JSON.stringify(props.callToActionResults));
    }

    render() {
        return <div>
            <DataTable
            data={this.props.callToActionResults}
            columns={columns}
            />
            
      </div>
    }
}

export default UserAction