var rowConverter = function(d) {
    return {
        age: d["age"],
        male: parseInt(d["male"]),
        female: parseInt(d["female"])
    }
}
d3.csv("https://raw.githubusercontent.com/justhoaian/DSDV_AvidCOVIDDataSimplifier/master/DSDV_Project_StackedBarChart_080620.csv", rowConverter, function(error, data) {
    if (error) {
        console.log(error);
    } else {
        console.log(data);

        //Total of "male" and "female" in a day
        var totalInDay = [];
        for (var i = 0; i < data.length; i++) {
            var sum = data[i].male + data[i].female;
            totalInDay.push(sum);
        }
        console.log(totalInDay);

        //Keys of "age"
        var keys = [];
        for (var i = 0; i < data.length; i++) {
            keys.push(data[i].age);
        }
        console.log(keys);

        //Dimession and Margin
        var margin = { top: 10, bottom: 40, left: 65, right: 10 };
        var width = 830 - margin.left - margin.right;
        var height = 460 - margin.top - margin.bottom;

        var xScale = d3.scaleLinear()
            .range([0, width])
            .domain([0, d3.max(totalInDay)]);

        var yScale = d3.scaleBand()
            .range([height, 0])
            .paddingInner(0.05)
            .align(0.1)
            .domain(keys);

        var colorScale = d3.scaleOrdinal()
            .range(["#ff6699", "#008ae6"]);

        var svg = d3.select("#barchart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("border", "1px solid DodgerBlue")
			.style("border-radius", "15px")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //X-Axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("y", 12)
            .attr("x", -6)
            .attr("dy", ".35em")
            .style("text-anchor", "start");

        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .text("Number of People");

        //Y-Axis
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(yScale))
            .selectAll("text")
            .attr("transform", "rotate(-20)");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .text("Age Groups");

        //Tooltip
        var div = d3.select("#barchart").append("div")
            .attr("class", "tooltip4")
            .style("opacity", 0);

        //Bars of "male"
        svg.selectAll("rectMale")
            .data(data)
            .enter().append("rect")
            .attr("y", function(d) {
                return yScale(d.age);
            })
            .attr("width", function(d) {
                return xScale(d.male);
            })
            .attr("height", function(d) {
                return yScale.bandwidth();
            })
            .attr("fill", "#008ae6")
            .on("mouseover", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", "#0000ff")
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("Male" + "<br/>" + d.age + " year(s) old" + "<br/>" + d.male + " person(s)")
                    .style("left", (d3.event.pageX - 795) + "px")
                    .style("top", (d3.event.pageY - 570) + "px");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", "#008ae6")
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        //Bars of "female"
        svg.selectAll("rectFemale")
            .data(data)
            .enter().append("rect")
            .attr("x", function(d) {
                return xScale(d.male);
            })
            .attr("y", function(d) {
                return yScale(d.age);
            })
            .attr("width", function(d) {
                return xScale(d.female);
            })
            .attr("height", function() {
                return yScale.bandwidth();
            })
            .attr("fill", "#ff6699")
            .on("mouseover", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", "#e6007a")
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("Female" + "<br/>" + d.age + " year(s) old" + "<br/>" + d.female + " person(s)")
                    .style("left", (d3.event.pageX - 795) + "px")
                    .style("top", (d3.event.pageY - 570) + "px");
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", "#ff6699")
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Legend
        var gender = ["Female", "Male"];

        var legend = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 15)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(gender)
            .enter().append("g")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", colorScale);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) {
                return d;
            });
    }
})
