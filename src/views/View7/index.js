import React, { Component } from 'react';
//import MapChart from '../../charts/MapChart';
import CoronaBubble from '../../charts/WorldBubbleChart';
//import RaceBubble from '../../charts/RaceBubble';
//import * as d3 from 'd3';
import './view7.css';

export default class View7 extends Component {

    render() {
        const {data,selectedCountry} = this.props;

        return (
            <div id='view7' className='pane'>
                <div style={{ overflowX: 'scroll',overflowY:'hidden' }}>
                        <svg width="900" height="500">
                            <CoronaBubble  data={data} selectedCountry={selectedCountry}/>
                        </svg>
                </div>
            </div>
        )
    }
}

