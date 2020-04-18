import React, {Component} from 'react';
// import queue from 'queue';
// import topojson from 'topojson';
import * as topojson from 'topojson';
import * as d3 from 'd3';
import {findCountryData,summarizeCountry,latestDate} from '../util.js';
import world from '../../data/world-topo.json';
//import world from '../../data/countries_geo.json';
//import { timeParse, timeFormat } from 'd3-time-format';
import { legendColor,legendHelpers } from 'd3-svg-legend';
import d3Tip from "d3-tip";
import './style.css';


class CoronaBubble extends Component {

    constructor(props) {
      super(props);
      var lDate = latestDate(this.props.data);
      this.state = { date: lDate, datatype:'deaths' };
    }

    drawmap()
    {
        console.log("CoronaBubble:drawmap");
        const svg = d3.select(this.refs.anchor),{data } = this.props;
        const projection = d3.geoMercator().center([30, 40 ])
            .scale(120);
        const path = d3.geoPath(projection);
        const groups = ['country', 'date'];
        var grouped = {};

        var tip = d3Tip()
          .attr('class', 'd3-tip')
          .direction('s')
          .html(function(d) {
            var country = d.properties['name'];
//            var country = d.properties['ADMIN'];
            var summary =  summarizeCountry(data,country);

            var tipstring = "<strong>"+country+"</strong><br>"+"<strong>Confirmed:</strong><span style='color:red'>" + summary.confirmed + "</span><br>"+"<strong>deaths:</strong><span style='color:red'>" + summary.deaths + "</span><br>"+"<strong>active:</strong><span style='color:red'>" + summary.active + "</span><br>"+"<strong>recovered:</strong><span style='color:red'>" + summary.recovered + "</span><br>";

            return tipstring;
          })

        data.forEach(function (a) {
            groups.reduce(function (o, g, i) {  // take existing object,
                o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
                return o[a[g]];                                           // at last, then an array
            }, grouped).push(a);
        });

        d3.selectAll("#worldgroup,.legendLinear").remove();
        const g = svg.append( "g" ).attr("id","worldgroup");


        var linear_color = d3.scaleThreshold()
            .domain([500,1000,2000,5000,10000,20000,50000,100000])
            .range(d3.schemeBlues[9]);


        g.append('circle')
            .attr('id', 'tipfollowscursor')
            .attr('r',15)
            .style("opacity", 0.0)
            .attr('fill','red');
        g.call(tip);
        g.selectAll("path .worldpath")
          .data(topojson.feature(world, world.objects.units).features)
//          .data(world.features)
          .call(tip)
           .join("path")
            .attr("fill", (d)=>{
                    var country =d.properties['name'];
//                    var country =d.properties['ADMIN'];
                    var number = findCountryData(data,country,this.state.date)[this.state.datatype];
                    var color = linear_color(number);
                    return color;
                })
            .attr("class","worldpath")
            .attr("id",d => d.properties['name'])
//            .attr("id",d => d.properties['ADMIN'])
            .attr("stroke", "black")
            .attr("stroke-linejoin", "round")
            .attr("d", path)
            .on('click', d=>{
                console.log(d);
                this.props.onCountryChanged(d.properties['name']);
//                this.props.onCountryChanged(d.properties['ADMIN']);
                tip.hide();
            })
            .on('mouseover', function (d) {
                var target = d3.select('#tipfollowscursor')
                    .attr('cx', d3.event.offsetX)
                    .attr('cy', d3.event.offsetY - 5) // 5 pixels above the cursor
                    .node();
                tip.show(d, target);
            })
            .on('mouseout', tip.hide);

        g.append("g")
          .attr("class", "legendLinear")
          .attr("transform", "translate(30,270)");

        var legendLinear = legendColor()
          .shapeWidth(30)
          .labelFormat(d3.format(".0f"))
          .orient('vertical')
          .labels(legendHelpers.thresholdLabels)
          .scale(linear_color);

        g.select(".legendLinear")
          .call(legendLinear);


    }//drawmap


    componentDidMount() {
        console.log("CoronaBubble:componentDidMount")
        this.drawmap();
//        this.drawbubble();

    }

    componentDidUpdate() {
        console.log("CoronaBubble:componentDidUpdate");
//        this.drawbubble();
        this.drawmap();

    }

    render() {
        console.log("CoronaBubble:render");
//        const { worldData }  = this.state;

//        if(!world) {return null}


        return <g ref="anchor" />;
    }
}

export default CoronaBubble;
