import React, {Component} from 'react';
// import queue from 'queue';
// import topojson from 'topojson';
// import all of topojson?????
import * as topojson from 'topojson';
import * as d3 from 'd3';
import {findCountryData,summarizeCountry,latestDate} from '../util.js';
//import {createHistorySlider} from './createHistorySlider.js';
import world from '../../data/world-topo.json';
//import world from '../../data/countries_geo.json';
//import { timeParse, timeFormat } from 'd3-time-format';
import { legendColor } from 'd3-svg-legend';
import d3Tip from "d3-tip";
import './style.css';


class CoronaBubble extends Component {
//    state = {
//        date:'03/24/2020',
//        datatype:'deaths',
//    };

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
//        const date = this.state.date;
        const groups = ['country', 'date'];
        var grouped = {};
//        const format = timeFormat('%m/%d/%Y');
//        var timer = null;
//        var isPlaying = false;
//
//        var slider = createHistorySlider(
//            '#dateslider',width-200,80,'01/22/2020',this.state.date,(date)=>{
//                const d = format(date);
//
//                this.setState({
//                    date:d,
//                })
//        });

        var tip = d3Tip()
          .attr('class', 'd3-tip')
          .direction('s')
          .html(function(d) {
            var country = d.properties['name'];
            var summary =  summarizeCountry(data,country);

            var tipstring = "<strong>"+country+"</strong><br>"+"<strong>Confirmed:</strong><span style='color:red'>" + summary.confirmed + "</span><br>"+"<strong>deaths:</strong><span style='color:red'>" + summary.deaths + "</span><br>"+"<strong>active:</strong><span style='color:red'>" + summary.active + "</span><br>"+"<strong>recovered:</strong><span style='color:red'>" + summary.recovered + "</span><br>";

            return tipstring;
          })


//        d3.select("#play")
//              .attr("title","Play animation")
//              .on("click",function(){
//                if ( !isPlaying ){
//                  d3.select(this).classed("pause",true).attr("title","Pause animation");
//                  timer = setInterval(step, 100);
////                  isPlaying = true;
//                } else {
//                  clearInterval(timer);
//                  d3.select(this).classed("pause",false).attr("title","Play animation");
////                  isPlaying = false;
//                }
//              });

        data.forEach(function (a) {
            groups.reduce(function (o, g, i) {  // take existing object,
                o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
                return o[a[g]];                                           // at last, then an array
            }, grouped).push(a);
        });

        d3.selectAll("#worldgroup,.legendLinear").remove();
        const g = svg.append( "g" ).attr("id","worldgroup");


        var linear_color = d3.scaleThreshold()
            .domain([500,1000,2000,5000,10000,20000,50000,100000,200000])
            .range(d3.schemeBlues[9]);


//        findMax(data, "confirmed");

        g.append('circle')
            .attr('id', 'tipfollowscursor')
            .attr('r',15)
            .style("opacity", 0.0)
            .attr('fill','red');
        g.call(tip);
        g.selectAll("path .worldpath")
          .data(topojson.feature(world, world.objects.units).features)
          .call(tip)
           .join("path")
            .attr("fill", (d)=>{
                    var country =d.properties['name'];
////                    var summ = summarizeCountry(data,country);
                    var number = findCountryData(data,country,this.state.date)[this.state.datatype];
                    var color = linear_color(number);
                    return color;
                })
            .attr("class","worldpath")
            .attr("id",d => d.properties['name'])
            .attr("stroke", "black")
            .attr("stroke-linejoin", "round")
            .attr("d", path)
//            .on('mouseover', tip.show)
            .on('mouseover', function (d) {
                var target = d3.select('#tipfollowscursor')
                    .attr('cx', d3.event.offsetX)
                    .attr('cy', d3.event.offsetY - 5) // 5 pixels above the cursor
                    .node();
                tip.show(d, target);
            })
            .on('mouseout', tip.hide);
//            .append("title")
//              .text(d => d.properties['name']);


// add zoom funtion for map
//        var zoom = d3.zoom()
//              .scaleExtent([1, 10])
//              .on('zoom', function() {
//                  d3.selectAll('#worldgroup,#circledgroup')
//                   .attr('transform', d3.event.transform);
//        });
//
//        svg.call(zoom);

//        function step(){
//            var currentdate = new Date(slider.value());
//            var maxdate= new Date(slider.max());
//            var mindate= new Date(slider.min());
//
//            if(currentdate < maxdate){
//                currentdate.setDate(currentdate.getDate() + 1);
//                const startdate = format(currentdate);
//            }else{
//                currentdate = mindate;
//                clearInterval(timer);
//                d3.select("#play").classed("pause",false).attr("title","Play animation");
//            }
//            slider.value(currentdate);
//        }
//
//        d3.select('#datatype').on('change',()=>{
//            var e = document.getElementById("datatype")
//            this.setState({datatype:e.options[e.selectedIndex].text});
//        });

        svg.append("g")
          .attr("class", "legendLinear")
          .attr("transform", "translate(30,270)");

        var legendLinear = legendColor()
          .shapeWidth(30)
//          .title("Corona cases by country")
          .labelFormat(d3.format(".0f"))
          .cells(10)
          .orient('vertical')
          .scale(linear_color);

        svg.select(".legendLinear")
          .call(legendLinear);

        //todo when change the selected country, try to show the tip of that country.
//        console.log("CoronaBubble:drawmap:",this.props.selectedCountry);
//        var evt = new MouseEvent("mouseover");
//        document.getElementById(this.props.selectedCountry).dispatchEvent(evt);

    }//drawmap


    drawbubble(){
        console.log("CoronaBubble:drawbubble");
        const svg = d3.select(this.refs.anchor),
        { data } = this.props;
//        const world = this.state.worldData;
        const groups = ['country', 'date'];
        const projection = d3.geoMercator();
        var grouped = {};

        data.forEach(function (a) {
            groups.reduce(function (o, g, i) {  // take existing object,
                o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
                return o[a[g]];                                           // at last, then an array
            }, grouped).push(a);
        });

        const color={
                        "deaths":'#ff8424',
                        "active":'#efb01d',
                        "recovered":'#a44afe'
                    };

        svg.selectAll("#circledgroup").remove();
        const g = svg.append( "g" ).attr("id","circledgroup");
        g.selectAll(".worldcircle")
          .data(topojson.feature(world, world.objects.units).features)
//          .data(world.features)
          .enter()
          .append("circle")
          .attr("r",(d)=>{
                var country = d.properties['name'];
                return Math.sqrt(findCountryData(grouped,country,this.state.date)[this.state.datatype])/2;
            })
          .attr("fill",color[this.state.datatype])
          .style("opacity", 0.2)
          .attr("class","worldcircle")
          .attr("transform",function(d){
            var p = projection(d3.geoCentroid(d)); //<-- centroid is the center of the path, projection maps it to pixel positions
            return "translate("+p+")";
          });

    }//drawbubble

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
