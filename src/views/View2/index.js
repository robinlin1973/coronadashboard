import React, { Component } from 'react';
//import { Avatar } from 'antd';
import './view2.css';
import { Table } from 'antd';
//import * as d3 from 'd3';
import {summarizeCountry,latestCountry} from "../../charts/util.js"


export default class View2 extends Component {

    render() {

        const columns = [
          {
            title: 'State/Pro',
            dataIndex: 'province',
            key: 'province',
            render: text => <a>{text}</a>,
          },
          {
            title: 'Deaths',
            dataIndex: 'deaths',
            key: 'deaths',
          },
          {
            title: 'Confirmed',
            dataIndex: 'confirmed',
            key: 'confirmed',
          },
            {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
          },
//         {
//            title: 'Recovered',
//            dataIndex: 'recovered',
//            key: 'recovered',
//          },
        ];

        var data = JSON.parse(JSON.stringify(this.props.data));
        const {selectedCountry,lDate} = this.props;


        if(data!=null)
        {
            var latest = latestCountry(data,selectedCountry);
            var summary = summarizeCountry(data,selectedCountry);
        }//if(data!=null)

        return (
            <div id='view2' className='pane'>
                <div className='countrytitle'>{this.props.selectedCountry} Detail:</div>
                <div><span className='total'>{summary.confirmed}</span> until <span className='date'>{lDate}</span></div>
                <Table columns={columns} dataSource={latest} />
            </div>
        )
    }//render
}


