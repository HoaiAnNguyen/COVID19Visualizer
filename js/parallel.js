var renderQueue = (function(func) {
    var _queue = [],
        _rate = 1000,
        _invalidate = function() {},
        _clear = function() {};

    var rq = function(data) {
        if (data) rq.data(data);
        _invalidate();
        _clear();
        rq.render();
    };

    rq.render = function() {
        var valid = true;
        _invalidate = rq.invalidate = function() {
            valid = false;
        };

        function doFrame() {
            if (!valid) return true;
            var chunk = _queue.splice(0, _rate);
            chunk.map(func);
            timer_frame(doFrame);
        }

        doFrame();
    };

    rq.data = function(data) {
        _invalidate();
        _queue = data.slice(0);
        return rq;
    };

    rq.add = function(data) {
        _queue = _queue.concat(data);
    };

    rq.rate = function(value) {
        if (!arguments.length) return _rate;
        _rate = value;
        return rq;
    };

    rq.remaining = function() {
        return _queue.length;
    };

    // clear the canvas
    rq.clear = function(func) {
        if (!arguments.length) {
            _clear();
            return rq;
        }
        _clear = func;
        return rq;
    };

    rq.invalidate = _invalidate;

    var timer_frame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function(callback) { setTimeout(callback, 17); };

    return rq;
});

var margin = { top: 66, right: 110, bottom: 20, left: 188 },
    w = document.body.clientWidth - margin.left - margin.right,
    h = 450 - margin.top - margin.bottom,
    innerHeight = h - 2;

var devicePixelRatio = window.devicePixelRatio || 1;
var renderQueue = (function(func) {
    var _queue = [],
        _rate = 1000,
        _invalidate = function() {},
        _clear = function() {};

    var rq = function(data) {
        if (data) rq.data(data);
        _invalidate();
        _clear();
        rq.render();
    };

    rq.render = function() {
        var valid = true;
        _invalidate = rq.invalidate = function() {
            valid = false;
        };

        function doFrame() {
            if (!valid) return true;
            var chunk = _queue.splice(0, _rate);
            chunk.map(func);
            timer_frame(doFrame);
        }

        doFrame();
    };

    rq.data = function(data) {
        _invalidate();
        _queue = data.slice(0);
        return rq;
    };

    rq.add = function(data) {
        _queue = _queue.concat(data);
    };

    rq.rate = function(value) {
        if (!arguments.length) return _rate;
        _rate = value;
        return rq;
    };

    rq.remaining = function() {
        return _queue.length;
    };

    // clear the canvas
    rq.clear = function(func) {
        if (!arguments.length) {
            _clear();
            return rq;
        }
        _clear = func;
        return rq;
    };

    rq.invalidate = _invalidate;

    var timer_frame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||

        function(callback) { setTimeout(callback, 17); };

    return rq;
});

var margin = { top: 1000, right: 110, bottom: 20, left: 108 },
    w = /*document.body.clientWidth*/ 1500 - margin.left - margin.right,
    h = 1650 - margin.top - margin.bottom,
    innerHeight = h - 2;

var devicePixelRatio = window.devicePixelRatio || 1;

var rowConverter = function(d) {
    return {
        province: d.province,
        "confirmed cases": parseFloat(d["confirmed cases"]),
        "recovered cases": parseFloat(d["recovered cases"]),
        "F0 (quarantined)": parseFloat(d["F0 (quarantined)"]),
        "F0(social)": parseFloat(d["F0(social)"]),
        F1: parseFloat(d["F1"]),
        Fn: parseFloat(d.Fn),
        Region: d.Region
    };
}
var color = d3.scaleOrdinal()
    .domain(["North", "Central", "South"])
    .range(["#FF0000", "#0000FF", "green"])

var region = ['North', 'Central', 'South']

var types = {
    "Number": {
        key: "Number",
        coerce: function(d) { return +d; },
        extent: d3.extent,
        within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
        defaultScale: d3.scaleLinear().range([innerHeight, 0])
    },
    "String": {
        key: "String",
        coerce: String,
        extent: function(data) { return data; },
        within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
        defaultScale: d3.scalePoint().range([0, innerHeight])
    }
}

var dimensions = [

    {
        key: "province",
        description: "province",
        type: types["String"],
        axis: d3.axisLeft()
            .tickFormat(function(d, i) {
                return d;
            })
    },
    /*  {
      key: "Region",
      description: "Region",
      type: types["String"],
      axis: d3.axisLeft()
              .tickFormat(function(d,i) {
                  return d;
              })
      },*/
    {
        key: "confirmed cases",
        description: "confirmed cases",
        type: types["Number"]
    },
    {
        key: "recovered cases",
        description: "recovered cases",
        type: types["Number"]
    },
    {
        key: "F0 (quarantined)",
        type: types["Number"],
        description: "F0 (quarantined)"
    },
    {
        key: "F0(social)",
        type: types["Number"],
        description: "F0 (social)"
    },
    {
        key: "F1",
        description: "F1",
        type: types["Number"]
    },
    {
        key: "Fn",
        description: "Fn",
        type: types["Number"]
    }
]

var xscale = d3.scalePoint()
    .domain(d3.range(dimensions.length))
    .range([0, w]);

var yAxis = d3.axisLeft();

var container = d3.select("#container")
    .attr("class", "parcoords")
    .style("width", w + margin.left + margin.right + "px")
    .style("height", h + margin.top + margin.bottom + "px");


var svg = container.append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + 130 + "," + margin.top + ")");

var foreignObject = svg.append("foreignObject")
    .attr("width", w)
    .attr("height", h)
    .attr("x", 0)
    .attr("y", 0)

var foBody = foreignObject.append("xhtml:body")
    .style("margin", "0px")
    .style("padding", "0px")
    .style("background-color", "none")
    .style("width", w + "px")
    .style("height", h + "px");

var canvas = foBody.append("canvas")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", w * devicePixelRatio + "px")
    .attr("height", h * devicePixelRatio + "px")
    .style("width", w + "px")
    .style("height", h + "px")

var ctx = canvas.node().getContext("2d");

ctx.globalCompositeOperation = 'darken';
ctx.globalAlpha = 1;
ctx.lineWidth = 1.5;
ctx.scale(devicePixelRatio, devicePixelRatio);

var output = d3.select("#container").append("pre");

d3.csv("https://raw.githubusercontent.com/tranquynhanh/book3.csv/master/project.csv", function(data) {
    var axes = svg.selectAll(".axis")
        .data(dimensions)
        .enter()
        .append("g")
        .attr("class", function(d) { return "axis " + d.key.replace(/ /g, "_"); })
        .attr("transform", function(d, i) { return "translate(" + xscale(i) + ")"; });

    data.forEach(function(d) {
        dimensions.forEach(function(p) {
            d[p.key] = !d[p.key] ? null : p.type.coerce(d[p.key]);
        });

        // truncate long text strings to fit in data table
        for (var key in d) {
            if (d[key] && d[key].length > 35) return d[key].slice(0, 36);
        }
    });

    dimensions.forEach(function(dim) {
        if (!("domain" in dim)) {
            dim.domain = d3_functor(dim.type.extent)(data.map(function(d) { return d[dim.key]; }));
        }
        if (!("scale" in dim)) {
            dim.scale = dim.type.defaultScale.copy();
        }
        dim.scale.domain(dim.domain);
    });

    var render = renderQueue(draw).rate(30);

    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 0.8; // d3.min([1.15/Math.pow(data.length,0.3),1]);
    render(data);

    axes.append("g")
        .each(function(d) {
            var renderAxis = "axis" in d ?
                d.axis.scale(d.scale) :
                yAxis.scale(d.scale);
            d3.select(this).call(renderAxis);
        })
        .append("text")
        .attr("class", "title")
        .attr("text-anchor", "start")
        .attr("fill", "black")
        .text(function(d) { return "description" in d ? d.description : d.key; });

    // Add brush for each axis.
    axes.append("g")
        .attr("class", "brush")
        .each(function(d) {
            d3.select(this).call(d.brush = d3.brushY()
                .extent([
                    [-10, 0],
                    [10, h]
                ])
                .on("start", brushstart)
                .on("brush", brush)
                .on("end", brush)
            )
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    output.text(d3.tsvFormat(data.slice(0, 31)));

    function project(d) {
        return dimensions.map(function(p, i) {
            // check if data element contains a value
            if (!(p.key in d) ||
                d[p.key] === null
            ) return null;

            return [xscale(i), p.scale(d[p.key])];
        });
    };

    function draw(d) {
        ctx.strokeStyle = color(d.Region);
        ctx.beginPath();
        var coords = project(d);
        coords.forEach(function(p, i) {
            if (p === null) {

                if (i > 0) {
                    var prev = coords[i - 1];
                    if (prev !== null) {
                        ctx.moveTo(prev[0], prev[1]);
                        ctx.lineTo(prev[0] + 6, prev[1]);
                    }
                }
                if (i < coords.length - 1) {
                    var next = coords[i + 1];
                    if (next !== null) {
                        ctx.moveTo(next[0] - 6, next[1]);
                    }
                }
                return;
            }

            if (i == 0) {
                ctx.moveTo(p[0], p[1]);
                return;
            }

            ctx.lineTo(p[0], p[1]);
        });
        ctx.stroke();
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }


    function brush() {
        render.invalidate();

        var actives = [];
        svg.selectAll(".axis .brush")
            .filter(function(d) {
                return d3.brushSelection(this);
            })
            .each(function(d) {
                actives.push({
                    dimension: d,
                    extent: d3.brushSelection(this)
                });
            });

        var selected = data.filter(function(d) {
            if (actives.every(function(active) {
                    var dim = active.dimension;
                    // test if point is within extents for each active brush
                    return dim.type.within(d[dim.key], active.extent, dim);
                })) {
                return true;
            }
        });

        // show ticks for brush dimensions and filter ticks to only those within brush extents

        svg.selectAll(".axis")
            .filter(function(d) {
                return actives.indexOf(d) > -1 ? true : false;
            })
            .classed("active", true)
            .each(function(dimension, i) {
                var extent = extents[i];
                d3.select(this)
                    .selectAll(".tick text")
                    .style("display", function(d) {
                        var value = dimension.type.coerce(d);
                        return dimension.type.within(value, extent, dimension) ? null : "none";
                    });
            });

        // reset dimensions without brushes
        svg.selectAll(".axis")
            .filter(function(d) {
                return actives.indexOf(d) > -1 ? false : true;
            })
            .classed("active", false)
            .selectAll(".tick text")
            .style("display", null);


        ctx.clearRect(0, 0, w, h);
        ctx.globalAlpha = d3.min([1.9 / Math.pow(selected.length, 0.3), 1]);
        render(selected);

        output.text(d3.tsvFormat(selected.slice(0, 31)));
    }
});

function d3_functor(v) {
    return typeof v === "function" ? v : function() { return v; };
};
var size = 20
svg.selectAll("circle")
    .data(region)
    .enter()
    .append("circle")
    .attr("cx", 1300)
    .attr("cy", function(d, i) { return 10 + i * (size + 5) })
    .attr("r", 7)
    .style("fill", function(d) { return color(d) })

svg.selectAll("labels")
    .data(region)
    .enter()
    .append("text")
    .attr("x", 1300 + size * .8)
    .attr("y", function(d, i) { return i * (size + 5) + (size / 2) })
    .text(function(d) { return d })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")