d3.csv("driving.csv", d3.autoType).then((data) => {
    console.log("data",data);
    
    // chart initialization
    let margin = {top:25, right:25,left:40,bottom:25};
    let outHeight = 500;
    let outWidth = 960;
    let width = outWidth - margin.left - margin.right,
        height = outHeight - margin.top - margin.bottom;

    const svg = d3.select('.chart').append('svg')
        .attr("width", outWidth)
        .attr("height", outHeight);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.right})`);

    let xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.miles)).nice()
        .range([0,width]);
    let yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.gas)).nice()
        .range([height,0]);

    // ???
    //const dollarFormat = function(d) { return '$' + d3.format(',f')(d.gas) };

    const xAxis = d3.axisBottom()
        .scale(xScale);
    const yAxis = d3.axisLeft()
        .scale(yScale);
    //    .tickFormat(dollarFormat);

    const points = g.selectAll("circle")
        .data(data);

    g.append("g")
		.attr("class", "axis x-axis")
		.attr("transform", `translate(0, ${height})`)
		.transition()
		.call(xAxis);
	
	g.append("g")
		.attr("class", "axis y-axis")
		.transition()
		.call(yAxis);
        
    const line = d3
        .line()
        .x(d=>xScale(d.miles))
        .y(d=>yScale(d.gas));

    g.append("path")
        .datum(data)
        .attr("d",line)
        .attr("fill","none")
        .attr("stroke","black");
        
    points.enter()
        .append("circle")
        .attr("cx",d=>xScale(d.miles))
        .attr("cy",d=>yScale(d.gas))
        .attr("r",5)
        .attr("fill","white")
        .attr("stroke","black");


    //issues with missing label values
    const labels = g.selectAll("text")
        .data(data);

    labels.enter()
        .append("text")
        .attr("x",d=>xScale(d.miles))
        .attr("y",d=>yScale(d.gas))
        .attr("stroke-linejoin","round")
        .text(d=>d.year)
        .each(position)
        .call(halo);

    // yAxis.call(yAxis)
    //     .call(g => g.select(".domain").remove());

  });

  function position(d) {
    const t = d3.select(this);
    switch (d.side) {
      case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
      case "right":
        t.attr("dx", "0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "start");
        break;
      case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
      case "left":
        t.attr("dx", "-0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "end");
        break;
    }
  }

  function halo(text) {
    text
      .select(function() {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
      })
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round");
  }