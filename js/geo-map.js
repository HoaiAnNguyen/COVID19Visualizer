//Width and height of map
var width = 510;
var height = 450;

//Define map projection
var projection = d3.geoAlbers()
    .center([100, 4.4])
    .rotate([0, 32])
    .parallels([11, 20])
    .scale([1100])
    .translate([width / 30, height / 1.3]);

//Define path generator
var path = d3.geoPath()
    .projection(projection);

// Zoom
var zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([
        [0, 0],
        [width, height]
    ])
    .extent([
        [0, 0],
        [width, height]
    ])
    .on("zoom", zoomed);

//Create SVG element
var svg = d3.select("#geo-map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid DodgerBlue")
	.style("border-radius", "15px")
    .call(zoom)
var g = svg.append("g");

//Define color scale
var colorScale = d3.scaleQuantize()
    .range(["rgb(255,218,185)", "rgb(244,164,96)", "rgb(210,105,30)", "rgb(139,69,19)"]);

// Define the div for the tooltip
var tooltip1 = d3.select("body").append("div")
    .attr('id', 'tooltip1')
    .style('position', 'absolute')
    .style("background-color", "rgb(57, 60, 63)")
    .style('padding', 6 + 'px')
    .style('display', 'none')
    .style("opacity", 0)
    .style('display', 'block')
    .style('font-size', 12)
    .style('border', 5)
    .style('text-align', 'center');

//Load in data
d3.csv("https://raw.githubusercontent.com/nngockhanhh/dsdv/master/geomap.csv", function(data) {

    //Set domain for color scale
    colorScale.domain([
        d3.min(data, function(d) {
            return d.cases;
        }),
        d3.max(data, function(d) {
            return d.cases;
        })
    ]);

    //Load GeoJSON data and merge with provinces data
    d3.json("https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json", function(json) {

        //Loop through each province data cases in the .csv file
        for (var i = 0; i < data.length; i++) {

            //Grab data province 
            var dataProvince = parseFloat(data[i].ma);
            console.log(json.features[0].properties.Ma);

            //Grab data cases
            var dataC = data[i].cases;

            //Find the corresponding province inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {

                var jsonProvince = json.features[j].properties.Ma;

                if (dataProvince == jsonProvince) {

                    //Copy the data cases into the JSON
                    json.features[j].properties.cases = dataC;

                    //Stop looking through the JSON
                    break;
                }
            }

            //Loop to get province name
            //Grab province name
            var dataName = data[i].province;

            //Find the corresponding province inside the GeoJSON
            for (var k = 0; k < json.features.length; k++) {

                var jsonProvince = json.features[k].properties.Ma;

                if (dataProvince == jsonProvince) {

                    //Copy the data cases into the JSON
                    json.features[k].properties.province = dataName;

                    //Stop looking through the JSON
                    break;
                }
            }
        }

        //Bind data to the SVG and create one path per GeoJSON feature
        var map = g.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function(d) {
                var value = d.properties.cases;
                if (value > 0) {
                    return colorScale(value);
                } else {
                    return "#ccc";
                }
            })
            .on("mouseover", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .style("stroke", "#404040")

                tooltip1
                    .transition()
                    .duration(200)
                    .style("opacity", 0.9)
                    .style("stroke", "black")
                tooltip1.html(d.province);
            })
            .on("mousemove", function(d) {
                tooltip1
                    .style("top", (d3.event.pageY) + "px")
                    .style("left", (d3.event.pageX + 15) + "px")

                tooltip1.html(d.properties.province.bold() + (" <br>Confirmed cases: ").bold() + d.properties.cases.bold())
                    .style("color", 'white')
                    .style('border-radius', '8px');
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("stroke", "transparent")
                tooltip1
                    .transition()
                    .duration(200)
                    .style("opacity", 0);
            });

    });

});

function zoomed() {
    g
        .selectAll('path') // To prevent stroke width from scaling
        .attr('transform', d3.event.transform);
}