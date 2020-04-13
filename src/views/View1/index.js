import React, { Component } from 'react';
//import { Avatar } from 'antd';
import './view1.css';
import { Table } from 'antd';
//import * as d3 from 'd3';


export default class View1 extends Component {
    handleDoubleClick=(record, rowIndex)=>{
        this.props.onCountryChanged(record.country);
    }
    render() {
        const columns = [
          {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
          },
          {
            title: 'Deaths',
            dataIndex: 'deaths',
            key: 'deaths',
          }
        ];


        const {data} = this.props;
        let date = null,total = 0;


        if(data!=null)
        {
            const today = new Date();
            const closest = data.reduce((a, b) => a.Date - today < b.Date - today ? a : b);
            date= closest.date;
            const latest_data = data.filter((row)=>{return(row.date===date);});

            var  helper = {};
            var sum_by_country = latest_data.reduce(function(r, o) {
              var key = o.country;

              if(!helper[key]) {
                helper[key] = Object.assign({}, o); // create a copy of o
                r.push(helper[key]);
              } else {
                helper[key].confirmed = parseInt(helper[key].confirmed) + parseInt(o.confirmed);
                helper[key].recovered = parseInt(helper[key].recovered) + parseInt(o.recovered);
                helper[key].deaths = (parseInt(helper[key].deaths) + parseInt(o.deaths));
              }

              return r;
            }, []);


            var sums = sum_by_country.map(function(d) {
              return {
                country: d.country,
                deaths:Math.round(d.deaths),
                confirmed: Math.round(d.confirmed),
                recovered: Math.round(d.recovered),
              }
            });

            sums.sort(function(a,b) {
                return b.confirmed-a.confirmed;
            });
            total= sums.reduce((a, b) => +a + +b.confirmed, 0);;

        }//if(data!=null)

        return (
            <div id='view1' className='pane'>
                <div className='confirmed'>Confirmed:</div>
                <div><span className='total'>{total}</span> until <span className='date'>{date}</span></div>
                <Table columns={columns} dataSource={sums}
                      onRow={(record, rowIndex) => {
                      return {
                          onClick: event => {this.handleDoubleClick(record, rowIndex)} // double click row
                        };
                      }}
                />
            </div>
        )
    }//render
}


