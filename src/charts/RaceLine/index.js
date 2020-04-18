import React , { Component }from 'react';
//import { BarStack } from '@vx/shape';
//import { Group } from '@vx/group';
//import { Grid } from '@vx/grid';
//import { AxisBottom } from '@vx/axis';
//import { cityTemperature } from '@vx/mock-data';
//import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { timeParse } from 'd3-time-format';
//import { withTooltip, Tooltip } from '@vx/tooltip';
//import { LegendOrdinal } from '@vx/legend';
//import {groupBy} from '../util.js'
import * as d3 from 'd3';


class CoronaLine extends Component{
   componentDidMount() {
       console.log("CoronaLine:componentDidMount()")
       this.drawsvg();


    }

    componentDidUpdate() {
        console.log("CoronaLine:componentDidUpdate()");
        d3.select(this.refs.anchorLine).selectAll('g').remove();
        this.drawsvg();
    }

    drawsvg(){
        console.log("CoronaLine:drawsvg()")
        var { width, height,data } = this.props;
        var svg = d3.select(this.refs.anchorLine)
                    .attr("transform", "translate(100,15)");

        var margin = {top: 20, right: 50, bottom: 30, left: 100};
        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;
        const parseDate = timeParse('%m/%d/%Y');//01/22/2020
        var x = d3.scaleTime().range([0, width]);
        var y =  d3.scaleLinear().range([height, 0]);
        const color=['#ff8424','#efb01d','#a44afe'];

        // sum the data for each country and date
        const groups=["country","date"];
        const columns=['confirmed','recovered','deaths'];
        var grouped = {};
        var sumcountry = {};
        var linedata = JSON.parse(JSON.stringify(data));

        linedata.forEach(function (a) {
            groups.reduce(function (o, g, i) {  // take existing object,
                o[a[g]] = o[a[g]] || (i + 1 === groups.length ? [] : {}); // or generate new obj, or
                return o[a[g]];                                           // at last, then an array
            }, grouped).push(a);
        });

        var rawcountry = grouped[this.props.selectedCountry];

        Object.keys(rawcountry).forEach(function(key,index) {
            var item ={};
            columns.forEach((i)=>{
                item[i]=rawcountry[key].reduce(function(acc,obj){return acc+parseInt(obj[i])},0);
            });
            sumcountry[key]= item;
        });
        // sum the data for each country and date

        var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d"));
        var yAxis = d3.axisLeft(y);

        var line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.price); })
            .curve(d3.curveCardinal);

          linedata.forEach(function(d) {
            d.date = parseDate(d.date);
          });

          var companies = [];
          const cols= ['active','recovered','deaths'];
          cols.forEach((category,index)=>{
              let obj=[];
              for (var date in sumcountry){
                  if(category === 'active'){
                      var con = parseInt(sumcountry[date]["confirmed"]);
                      var rec = parseInt(sumcountry[date]["recovered"]);
                      var det = parseInt(sumcountry[date]["deaths"]);
                      var active = (con-rec-det);
//                      console.log(sumcountry[date]);
                      obj.push({"date":parseDate(date),"price":active});
                  }else{
                    obj.push({"date":parseDate(date),"price":parseInt(sumcountry[date][category])});
                  }
              }
              companies.push({"name":category,"values":obj});
          });
//          console.log(companies);

          x.domain(d3.extent(linedata, function(d) { return d.date; }));
          y.domain([
            d3.min(companies, function(c) { return d3.min(c.values, function(v) { return v.price; }); }),
            d3.max(companies, function(c) { return d3.max(c.values, function(v) { return v.price; }); })
          ]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

            //Create Title
        svg.append("g").append("text")
            .attr("class","countrytitle")
            .attr("x", width / 2 )
            .attr("y", 20)
            .style("text-anchor", "middle")
            .text(this.props.selectedCountry);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0)")
            .call(yAxis);

        svg.append("line")
            .attr(
            {
                "class":"horizontalGrid",
                "x1" : 0,
                "x2" : width,
                "y1" : y(0),
                "y2" : y(0),
                "shape-rendering" : "crispEdges",
                "stroke" : "black",
                "stroke-width" : "1px",
                "stroke-dasharray": ("3, 3")
            });


        svg.selectAll(".raceline")
            .data(companies)
            .enter().append("g")
            .attr("class", "raceline")
            .on("click",()=>{console.log("clicked");});



        var path = svg.selectAll(".raceline").append("path")
            .attr("class", "line")
            .attr("d", function(d,index) {
              return line(d.values); })
            .style("stroke", function(d,i) {
              return color[i];
            });

        path.each(function(d,i) {
            if(columns.includes(d.name)){
                var totalLength = this.getTotalLength();
                d3.select(this)
                .attr("stroke-dasharray", totalLength + " " + totalLength )
                .attr("transform", "translate(0)")
                .on('click',()=>{
                    d3.select(this).attr("stroke-dashoffset", totalLength)
                      .transition()
                      .duration(2000)
                      .ease(d3.easeLinear)
                      .attr("stroke-dashoffset", 0);
                });

            }
        });

          var legend = svg.selectAll('g .legend')
              .data(cols)
              .enter()
            .append('g')
              .attr('class', 'legend');

          legend.append('rect')
              .attr('x', 60)
              .attr('y', function(d, i){ return i * 30 +30 ;})
              .attr('width', 20)
              .attr('height', 20)
              .style('fill', function(d,i) {
                return color[i];
              });

          legend.append('text')
              .attr('x', 90)
              .attr('y', function(d, i){ return (i * 30) + 45;})
              .text(function(d){ return d; });


    // append a g for all the mouse over nonsense
    var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    // this is the vertical line
    mouseG.append("path")
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    // keep a reference to all our lines
    var lines = document.getElementsByClassName('line');

    // here's a g for each circle and text on the line
    var mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(d3.range(lines.length))
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    // the circle
    mousePerLine.append("circle")
      .attr("r", 7)
      .style("stroke", function(d) {
        return 'black';
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    // the text
    mousePerLine.append("text")
      .attr("transform", "translate(10,3)");

    // rect to capture mouse movements
    mouseG.append('svg:rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);

        // move the vertical line
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        // position the circle and text
        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
//            var xDate = x.invert(mouse[0]);

            // since we are use curve fitting we can't relay on finding the points like I had done in my last answer
            // this conducts a search using some SVG path functions
            // to find the correct position on the line
            // from http://bl.ocks.org/duopixel/3824661
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              var pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }

            // update the text with y value
            d3.select(this).select('text')
              .text(y.invert(pos.y).toFixed(0));

            // return position
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      });


    }

    render(){
        console.log("CoronaLine:render()");

        const {data} = this.props;

        if(!data){
            return null;
        }
        return <g ref="anchorLine" />;
    }
}

export default CoronaLine;


