const height = 700;
const width = 1200;
const padding = 60;


d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', (err, json) => {
	const { data } = json;
	const rectWidth = width / data.length;

	data.forEach(d => d[0] = new Date(d[0]));


	const svg = d3.select('svg')
	  .attr('width', width)
	  .attr('height', height);

	
	const yMax = d3.max(data, d => d[1]);
	const xExtent = d3.extent(data, d => d[0]);

	const xScale = d3.scaleTime()
	  .domain(xExtent)
	  .range([padding, width - padding]);

	const yScale = d3.scaleLinear()
	  .domain([0, yMax])
	  .range([height - padding, padding]);


	const xAxis = d3.axisBottom(xScale)
	  .tickFormat(d3.timeFormat('%Y'));

	const yAxis = d3.axisLeft(yScale);

	const tooltip = d3.select('body')
	  .append('div')
	  .classed('tooltip', true);

// ====================================
// X and Y Axis
// ====================================
	svg.append('g')
		.attr('transform', `translate(0, ${height - padding + 1})`)
	  .call(xAxis);

	svg.append('g')
		.attr('transform', `translate(${padding - 2}, 0)`)
	  .call(yAxis);


// ====================================
// Bars
// ====================================
	svg.selectAll('rect')
	  .data(data)
	  .enter()
	  .append('rect')
	  .attr('x', d => xScale(d[0]))
	  .attr('y', height - padding)
	  .attr('fill', 'blue')
	  .attr('stroke', '#fff')
	  .attr('width', rectWidth)
	  .transition()
	  .ease(d3.easeBounce)
	  .duration(1000)
	  .attr('y', d => yScale(d[1]))
	  .attr('height',d => height - padding - yScale(d[1]));


	svg.selectAll('rect')
	  .on('mouseover', d => {
	  	tooltip
	  	  .style('opacity', 1)
	  	  .style('left', `${d3.event.x}px`)
	  	  .style('top', `${d3.event.y}px`)
	  	  .html(`
	  	  	<h3>${d3.timeFormat('%b %Y')(d[0])}</h3>
	  	  	<h3>$${d[1]}0 Billion</h3>
	  	  `);
	  })
	  .on('mouseout', () => {
	  	tooltip.style('opacity', 0);
	  });
// =================================
// Title
// =================================
	svg.append('text')
	  .text('GDP Across Time')
	  .attr('x', width / 2)
	  .attr('y', padding - 10)
	  .attr('text-anchor', 'middle')
	  .attr('font-size', '3em');
});