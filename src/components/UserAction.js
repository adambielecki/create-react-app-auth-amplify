import React, { Component } from 'react'
import DataTable from 'react-data-table-component'
import styled from "styled-components";
import { Pie } from '@reactchartjs/react-chart.js'


const columns = [
    {
        name: "Requested at",
        selector: "dateTime",
        sortable: true
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

const columnsForUnityActions = [
    {
        name: "Action type",
        selector: "actionType",
        sortable: true
    },
    {
        name: "Date",
        selector: "dateTime",
        sortable: true
    },
    {
        name: "Client ip",
        selector: "ip",
        sortable: true
    }
];


class UserAction extends Component {
    constructor(props) {
        super(props);

        var openPresentation1Count = 0;
        var openPresentation2Count = 0;
        var videoPlayedCount = 0;

        props.userUnityActions.filter(op => { if(op.actionType == "OpenPresentation 1") {
            openPresentation1Count++;
        } });
        props.userUnityActions.filter(op => { if(op.actionType == "OpenPresentation 2") {
            openPresentation2Count++;
        } });
        props.userUnityActions.filter(op => { if(op.actionType == "Video Played") {
            videoPlayedCount++;
        } });

        this.state = {
            chartData: {
                labels: ['Open Presentation 1', 'Open Presentation 2', 'Video Played', 'Speak to Representative'],
                datasets: [
                    {
                        label: '# of Votes',
                        data: [openPresentation1Count, openPresentation2Count, videoPlayedCount, props.callToActionResults.length],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1,
                    },
                ],
            }
        };
        console.log("User call to action " + JSON.stringify(props.callToActionResults));
        console.log("User actions from User action " + JSON.stringify(props.userUnityActions));
        console.log("User action state data : " + JSON.stringify(this.state.chartData));
    }

    render() {
        return <div>

            <Pie data={this.state.chartData} />

            <h4 class="display-6 p-3">Speak to a representative</h4>

            <DataTable
                data={this.props.callToActionResults}
                columns={columns}
                pagination={true}
            />
            <h4 class="display-6 p-3">Other actions</h4>

            <DataTable
                data={this.props.userUnityActions}
                columns={columnsForUnityActions}
                pagination={true}

            />

        </div>
    }
}

export default UserAction