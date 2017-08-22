

//setting dimensions
var clientWidth = document.documentElement.clientWidth,
	clientHeight = document.documentElement.clientHeight,
	margin = {top: 20, right: 100, bottom: 150, left: 100},
    width = clientWidth - margin.left - margin.right,
    height = clientHeight - margin.top - margin.bottom;

//setting parser
var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L");


//setting ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

//path
var valueline = d3.line()
    		.x(function(d) { return x(d.measurement_timestamp); })
    		.y(function(d) { return y(d.wind_speed); });


// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


//rest call
d3.json("https://data.cityofchicago.org/resource/77jv-5zb8.json?$where=measurement_timestamp%3E%222017-03-05T16:00:00.000%22%20AND%20station_name=%22Foster%20Weather%20Station%22&$order=measurement_timestamp%20DESC&$limit=10",function(error,response){

//process http call
  response.forEach(function(d) {
      d.measurement_timestamp = parseTime(d.measurement_timestamp);
      d.wind_speed = +d.wind_speed;
  });
 

//render the graph
 x.domain(d3.extent(response, function(d) { return d.measurement_timestamp; }));
  y.domain([0, d3.max(response, function(d) { return d.wind_speed; })]);

  // Add the valueline path.
  svg.append("path")
      .data([response])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the X Axis
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat("%H:%M")))
      .selectAll("text")	
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

  // Add the Y Axis
  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    // text label for the x axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 50) + ")")
      .attr("class", "xylabels")
      .style("text-anchor", "middle")
      .text("Time");

  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "xylabels")
      .style("text-anchor", "middle")
      .text("Meters Per Second");      



});
