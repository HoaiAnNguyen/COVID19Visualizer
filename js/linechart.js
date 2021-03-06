var rowConverter = function(d) {
    return {
        Type: d["Case type"],
        Total: parseInt(d["Number of cases"]),
        Date: d3.timeParse("%d/%m/%Y")(d.Date)
    }
}


//Read the data
d3.csv("https://raw.githubusercontent.com/nngockhanhh/dsdv/master/multi-line-chart.csv", rowConverter, function(error, data) {
    if (error) {
        console.log(error);
    } else {
        console.log(data);

        var bisectDate = d3.bisector(function(d) {
            return d.Date;
        }).left;

        // Group the data by name
        var sumstat = d3.nest()
            .key(function(d) {
                return d.Type;
            })
            .entries(data);

        // Set the dimensions and margins of the graph
        var margin = {
                top: 45,
                right: 50,
                bottom: 105,
                left: 80
            },
            width = 750 - margin.right,
            height = 300;

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) {
                return d.Date;
            }))
            .range([0, width]);

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) {
                return +d.Total;
            })])
            .range([height, 0]);

        // Color palette
        var res = sumstat.map(function(d) {
            return d.key
        })
        var color = d3.scaleOrdinal()
            .domain(res)
            .range(['#e41a1c', '#377eb8', '#4daf4a'])

        // Append the svg object to the body of the page
        var svg = d3.select("#linechart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("border", "1px solid DodgerBlue")
			.style("border-radius", "15px")
			
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        //X Axis        
        xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat('%b %d, 2020')))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-30)")
			.style("border-radius", "15px")
            .style("text-anchor", "end");

        //Y Axis
        yAxis = svg.append("g")
            .call(d3.axisLeft(y));


        // Draw the line
        svg.selectAll(".line")
            .data(sumstat)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("class", function(d) {
                return "line " + d.key
            })
            .attr("stroke", function(d) {
                return color(d.key)
            })
            .attr("stroke-width", 2.5)
            .attr("d", function(d) {
                return d3.line()
                    .x(function(d) {
                        return x(d.Date);
                    })
                    .y(function(d) {
                        return y(+d.Total);
                    })
                    (d.values)
            })


        // Highlight the group that is hovered
        var highlight = function(d) {
            d3.selectAll(".line")
                .transition()
                .duration(500)
                .attr("opacity", 0.15)

            d3.selectAll("." + d.key)
                .transition()
                .duration(200)
                .attr("opacity", 1)
                .attr("stroke-width", 3.3)
        }

        // Do not highlight
        var doNotHighlight = function() {
            d3.selectAll(".line")
                .transition()
                .duration(500)
                .attr("opacity", 1)
                .attr("stroke-width", 2.5)
        }

        // Add legend for each name
        var size = 50
        svg.selectAll("myLine")
            .data(sumstat)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
                return 40 + i * (size + 180)
            })
            .attr("y", 368)
            .attr("width", size)
            .attr("height", size - 45)
            .style("fill", function(d) {
                return color(d.key)
            })
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight)

        // Add labels beside legend 
        svg.selectAll("mylabels")
            .data(sumstat)
            .enter()
            .append("text")
            .attr("x", function(d, i) {
                return 100 + i * (size + 180)
            })
            .attr("y", 369)
            .style("fill", function(d) {
                return color(d.key)
            })
            .text(function(d) {
                return d.key
            })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight)


        // Cursors
        var mouseG = svg.append("g")
            .attr("class", "mouse-over-effects");

        mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", "0");

        var lines = document.getElementsByClassName('line');

        var mousePerLine = mouseG.selectAll('.mouse-per-line')
            .data(sumstat)
            .enter()
            .append("g")
            .attr("class", "mouse-per-line");

        mousePerLine.append("circle")
            .attr("r", 6)
            .style("stroke", function(d) {
                return color(d.key);
            })
            .style("fill", "none")
            .style("stroke-width", 2.2)
            .style("opacity", "0");

        mousePerLine.append("text")
            .attr("transform", "translate(10,0)");

        var tooltip = d3.select("body").append("div")
            .attr('id', 'tooltip')
            .style('position', 'absolute')
            .style("background-color", "#e6e6e6")
            .style('padding', 6 + 'px')
            .style('display', 'none')

        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', width) // can't catch mouse events on a g element
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
                d3.selectAll("#tooltip").style('display', 'none')
            })
            .on('mouseover', function() { // on mouse in show line, circles and text
                d3.select(".mouse-line")
                    .style("opacity", "1");
                d3.selectAll(".mouse-per-line circle")
                    .style("opacity", "1");
                d3.selectAll(".mouse-per-line text")
                    .style("opacity", "0");
            })
            .on('mousemove', function() { // mouse moving over canvas
                var mouse = d3.mouse(this);

                d3.selectAll(".mouse-per-line")
                    .attr("transform", function(d, i) {

                        var xDate = x.invert(mouse[0]),
                            bisect = d3.bisector(function(d) {
                                return d.Date;
                            }).left;
                        idx = bisect(d.values, xDate);

                        d3.select(this).select("text")
                            .text(y.invert(y(d.values[idx].Total)).toFixed(0));

                        d3.select(".mouse-line")
                            .attr("d", function() {
                                var data = "M" + x(d.values[idx].Date) + "," + height;
                                data += " " + x(d.values[idx].Date) + "," + 0;
                                return data;
                            });
                        return "translate(" + x(d.values[idx].Date) + "," + y(d.values[idx].Total) + ")";
                    });
                updateTooltipContent(mouse, sumstat);
            });

        function updateTooltipContent(mouse, sumstat) {

            var sortingObj = []

            sumstat.map(d => {
                var xDate = x.invert(mouse[0]),
                    bisect = d3.bisector(function(d) {
                        return d.Date;
                    }).left;
                idx = bisect(d.values, xDate);

                sortingObj.push({
                    Type: d.values[idx].Type,
                    Total: d.values[idx].Total,
                    Date: d.values[idx].Date
                })
            })

            if (sortingObj[0] == null) return;

            sortingObj.sort((x, y) => y.Total - x.Total);

            tooltip.html(d => {
                    var string = (sortingObj[0].Date).toString();
                    var i = string.indexOf('00');
                    return string.substring(0, i);
                })
                .style('left', d3.event.pageX + 25 + "px")
                .style('top', d3.event.pageY - 50 + "px")
                .style('display', 'block')
                .style('font-size', 12)
                .style('border', 5)
                .style('border-radius', '8px')
                .selectAll()
                .data(sortingObj).enter()
                .append('div')
                .style('color', d => {
                    return color(d.Type)
                })
                .style('font-size', 12)
                .html(d => {
                    return d.Type + ": " + d.Total;
                })
        }

    }
})