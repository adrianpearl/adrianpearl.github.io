const data = {
  1990: [
    {group: 'Very high', pop: 0.512, hdi: 0.839},
    {group: 'High', pop: 0.624, hdi: 0.745},
    {group: 'Medium', pop: 0.748, hdi: 0.619},
    {group: 'Low', pop: 2.751, hdi: 0.460}
  ],
  1995: [
    {group: 'Very high', pop: 0.763, hdi: 0.849},
    {group: 'High', pop: 0.355, hdi: 0.737},
    {group: 'Medium', pop: 2.264, hdi: 0.600},
    {group: 'Low', pop: 1.694, hdi: 0.436}
  ],
  2000: [
    {group: 'Very high', pop: 0.846, hdi: 0.865},
    {group: 'High', pop: 0.478, hdi: 0.743},
    {group: 'Medium', pop: 2.340, hdi: 0.625},
    {group: 'Low', pop: 1.816, hdi: 0.461}
  ],
  2005: [
    {group: 'Very high', pop: 0.964, hdi: 0.880},
    {group: 'High', pop: 0.710, hdi: 0.741},
    {group: 'Medium', pop: 2.198, hdi: 0.653},
    {group: 'Low', pop: 1.986, hdi: 0.498}
  ],
  2010: [
    {group: 'Very high', pop: 1.084, hdi: 0.891},
    {group: 'High', pop: 2.277, hdi: 0.727},
    {group: 'Medium', pop: 1.810, hdi: 0.612},
    {group: 'Low', pop: 1.073, hdi: 0.498}
  ],
  2015: [
    {group: 'Very high', pop: 1.298, hdi: 0.892},
    {group: 'High', pop: 2.189, hdi: 0.752},
    {group: 'Medium', pop: 2.404, hdi: 0.636},
    {group: 'Low', pop: 0.752, hdi: 0.497}
  ],
  2017: [
    {group: 'Very high', pop: 1.439, hdi: 0.894},
    {group: 'High', pop: 2.379, hdi: 0.757},
    {group: 'Medium', pop: 2.733, hdi: 0.645},
    {group: 'Low', pop: 0.926, hdi: 0.504}
  ]
}

/*
const data = [
  {group: 'Very high', pop90: 0.528, hdi90: 0.905, pop18: 1.439, hdi18: 0.894},
  {group: 'High', pop90: 0.793, hdi90: 0.771, pop18: 2.379, hdi18: 0.757},
  {group: 'Medium', pop90: 0.793, hdi90: 0.620, pop18: 2.733, hdi18: 0.645},
  {group: 'Low', pop90: 3.172, hdi90: 0.450, pop18: 0.926, hdi18: 0.904}
]
*/

const mobile = ( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i));

const width = 500; //mobile != null ? 0.9*window.innerWidth : 500;
const height = width;
const margin = 20;
const dur = 1500;

const colors = ['#B6579F', '#F6D952', '#F09A52', '#ED2E6C'];
const color = d3.scaleOrdinal()
  .domain(data[2017].map(d => d.group))
  .range(colors);

const outerRad = Math.min(width, height) / 2 - margin;
const innerRad = outerRad / 3;

let arc = d3.arc()
  .innerRadius(innerRad)
  .outerRadius(outerRad - 1);

let svg = d3
  .select("#graphic")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [-width / 2, -height / 2, width, height])
  .attr("font-family", "sans-serif")
  .attr("text-anchor", "middle")
  .attr("font-size", "0.7em");

let y = d3.scaleLinear()
  .range([innerRad + 0.33*(outerRad - innerRad), outerRad]);

let yAxis = g => g
  .call(g => g.selectAll("g")
    .data(y.ticks(3))
    .enter().append("g")
      .attr("fill", "none")
      .call(g => g.append("circle")
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0.3)
          .attr("stroke-dasharray", 5)
          .attr("r", y)));

const pie = d3.pie()
  .padAngle(0)
  .sort(null)
  .value(d => d.pop);

let current_year = 1990;
let largest_group  = data[current_year].reduce(function(prev, current) {
  return (prev.pop > current.pop) ? prev : current
}).group

let arcs = pie(data[current_year]);
arcs.forEach(function(d) {
  d.rad = d.data.hdi*(outerRad - innerRad) + innerRad;
  d.midAngle = (d.startAngle + d.endAngle) / 2;
});

var path = svg.selectAll("path")
  .data(arcs)
  .join("path")
    .attr("fill", d => color(d.data.group))
    .attr("d", d => arc.outerRadius(d.rad)(d))
    .attr("id", d => d.data.group)
    .each(function(d) { this._current = d; });

let title = svg.append("g")
  .attr("font-size", "2em")
  .attr("font-weight", "bold")
  //.attr("transform", d => `translate(${width/2, height/2})`)
tyear = title.append("text")
  .attr("y", "-0.4em")
  .text(current_year)
title.append("text")
  .attr("y", "0.7em")
  .text("HDI");

let hdilabel = svg.append("g")
  .selectAll("text")
  .data(arcs)
  .join("text")
  .attr("dy", -5)

hdilabel.append("textPath")
  .attr("xlink:href", d => "#" + d.data.group)
  .attr("startOffset", d => `${offset(d)}%`)
  .attr("display", d => reverse(d) ? "none" : "inherit")
  .text(d => d.data.hdi);

let hdireverse = svg.append("g")
  .selectAll("text")
  .data(arcs)
  .join("text")
  .attr("letter-spacing", d => -4*d.rad/outerRad)
  .attr("dy", d => d.rad - innerRad + 12 + (mobile ? 8 : 0))

hdireverse.append("textPath")
  .attr("xlink:href", d => "#" + d.data.group)
  .attr("startOffset", d => `${reverse_offset(d)}%`)
  .attr("display", d => reverse(d) ? "inherit" : "none")
  .text(d => d.data.hdi);

var grouppath = svg.append("path")
  .attr("fill", "none")
  .attr("d", d => d3.arc()
      .innerRadius(outerRad + 3)
      .outerRadius(outerRad + 3)
      .startAngle(0)
      .endAngle(2*Math.PI)())
  .attr("id", d => 'group');

let grouplabel = svg.append("g")
  .selectAll("text")
  .data(arcs)
  .join("text")
    //.attr("font-size", 12)
    .attr("font-weight", "bold")
  .append("textPath")
    .attr("display", d => reverse(d) ? "none" : "inherit")
    .attr("startOffset", d => `${circle_offset(d)}%`)
    .attr("xlink:href", d => '#' + 'group')
    .text(d => d.data.group + ' human development');

let groupreverse = svg.append("g")
  .selectAll("text")
  .data(arcs)
  .join("text")
    //.attr("font-size", 12)
    .attr("font-weight", "bold")
    .attr("dy", "0.7em")
  .append("textPath")
    .attr("display", d => reverse(d) ? "inherit" : "none")
    .attr("startOffset", d => `${100 - circle_offset(d)}%`)
    .attr("xlink:href", d => '#' + 'group')
    .text(d => d.data.group + ' human development');

var greyband = svg.append("path")
  .attr("fill", "#E0E0E0")
  .attr("d", d => d3.arc()
      .innerRadius(innerRad*0.8)
      .outerRadius(innerRad)
      .startAngle(0)
      .endAngle(2*Math.PI)())

let poppath = svg.append("path")
  .attr("d", d => d3.arc()
      .innerRadius(innerRad)
      .outerRadius(innerRad)
      .startAngle(0)
      .endAngle(2*Math.PI)())
      .attr("id", d => 'pop');

let poplabel = svg.append("g")
  //.attr("font-size", 11)
  .selectAll("text")
  .data(arcs)
  .join("text")
    .attr("dy", "1.1em")
    .attr("letter-spacing", 1.2)
  .append("textPath")
    .attr("display", d => reverse(d) ? "none" : "inherit")
    .attr("startOffset", d => `${circle_offset(d)}%`)
    .attr("xlink:href", d => '#' + 'pop')
    .text(d => format_pop(d.data.pop) + (d.data.group == largest_group ? ' people' : ''));

let popreverse = svg.append("g")
  //.attr("font-size", 11)
  .selectAll("text")
  .data(arcs)
  .join("text")
    .attr("dy", "-0.4em")
    .attr("letter-spacing", 1.2)
  .append("textPath")
    .attr("display", d => reverse(d) ? "inherit" : "none")
    .attr("startOffset", d => `${100 - circle_offset(d)}%`)
    .attr("xlink:href", d => '#' + 'pop')
    .text(d => format_pop(d.data.pop) + (d.data.group == largest_group ? ' people' : ''));

svg.append("g")
  .call(yAxis);

function update(index) {
  stepSel.classed('is-active', (d, i) => i === index);
  let year = Object.keys(data)[index];

  if (year == current_year) {return;}
  current_year = year;

  largest_group  = data[year].reduce(function(prev, current) {
    return (prev.pop > current.pop) ? prev : current
  }).group

  tyear.text(year);
  //pie.value(function(d) { return d.pop; }); // change the value function
  arcs = pie(data[year]);
  arcs.forEach(function(d) {
    d.rad = d.data.hdi*(outerRad - innerRad) + innerRad;
    d.midAngle = (d.startAngle + d.endAngle) / 2;
  });
  path = path.data(arcs); // compute the new angles
  path.transition()
    .duration(dur)
    .attrTween("d", arcTween); // redraw the arcs
  
  hdilabel = hdilabel.data(arcs);
  hdilabel.select("textPath")
    .attr("display", d => reverse(d) ? "none" : "inherit")
    .transition()
    .duration(dur)
      .attr("startOffset", d => `${offset(d)}%`)
      .text(d => d.data.hdi)
    .on('end', function() {
      d3.select(this).text(d => d.data.hdi)// (d.data.group == largest_group ? 'Human Development Index value: ' : '') + d.data.hdi);
    });

  hdireverse = hdireverse.data(arcs);
  hdireverse
    .transition()
    .duration(dur)
      .attr("letter-spacing", d => -4*d.rad/outerRad)
      .attr("dy", d => d.rad - innerRad + 12 + (mobile ? 8 : 0));
  hdireverse.select("textPath")
    .attr("display", d => reverse(d) ? "inherit" : "none")
    .transition()
    .duration(dur)
      .attr("startOffset", d => `${reverse_offset(d)}%`)
      .text(d => d.data.hdi)
    .on('end', function() {
      d3.select(this).text(d => d.data.hdi) //(d.data.group == largest_group ? 'Human Development Index value: ' : '') + d.data.hdi);
    });

  grouplabel = grouplabel.data(arcs);
  grouplabel
    .attr("display", d => reverse(d) ? "none" : "inherit")
    .transition()
    .duration(dur)
    .attr("startOffset", d => `${circle_offset(d)}%`);

  groupreverse = groupreverse.data(arcs);
  groupreverse
    .attr("display", d => reverse(d) ? "inherit" : "none")
    .transition()
    .duration(dur)
    .attr("startOffset", function(d) {
      return `${100 - 12.5 * (d.endAngle + d.startAngle) / Math.PI}%`;
    });

  poplabel = poplabel.data(arcs);
  poplabel
    .attr("display", d => reverse(d) ? "none" : "inherit")
    .transition()
    .duration(dur)
    .attr("startOffset", d => `${circle_offset(d)}%`)
    .text(d => format_pop(d.data.pop))
    .on('end', function(d) {
      d3.select(this).text(d => format_pop(d.data.pop) + (d.data.group == largest_group ? ' people' : ''));
    });

  popreverse = popreverse.data(arcs);
  popreverse
    .attr("display", d => reverse(d) ? "inherit" : "none")
    .transition()
    .duration(dur)
    .attr("startOffset", d => `${100 - circle_offset(d)}%`)
    .text(d => format_pop(d.data.pop))
    .on('end', function(d) {
      d3.select(this).text(d => format_pop(d.data.pop) + (d.data.group == largest_group ? ' people' : ''));
    });

}

/*
BUTTON ONLY IN FIRST PROTOTYPE
function switch_year() {
  current_year = current_year == 2018 ? 1990 : 2018;
  update(current_year); 
}
*/

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc.outerRadius(i(t).rad)(i(t));
  };
}

function offset(a) {
  const theta = a.endAngle - a.startAngle;
  return 100*0.5*a.rad*theta / ((a.rad + innerRad)*theta + 2*(a.rad - innerRad));
}

function circle_offset(a) {
  let angle = 12.5 * (a.endAngle + a.startAngle) / Math.PI;
  if (current_year == 1990 && a.data.group == "Very high") {
    return angle*1.1;
  } else if (current_year == 1995 && a.data.group == "Very high") {
    return angle*0.9;
  } else {
    return angle;
  }
}

function reverse(a) {
  return a.midAngle > Math.PI/2 && a.midAngle < 3*Math.PI/2;
}

function reverse_offset(a) {
  const theta = a.endAngle - a.startAngle;
  return 100*(theta*(a.rad + 0.5*innerRad) + a.rad - innerRad) / ((a.rad + innerRad)*theta + 2*(a.rad - innerRad));
}

function format_pop(p) {
  if (p < 1) {
    return (p*1000).toString() + ' m';
  } else {
    return p.toString() + ' bn';
  }
}

const container = d3.select('#scrolly-side');
const stepSel = container.selectAll('.step');

function init() {
  Stickyfill.add(d3.select('.sticky').node());

	enterView({
		selector: stepSel.nodes(),
		offset: 0.5,
		enter: el => {
			const index = +d3.select(el).attr('data-index');
			update(index);
		},
		exit: el => {
			let index = +d3.select(el).attr('data-index');
			index = Math.max(0, index - 1);
			update(index);
		}
	});
}

init()

let svg90 = d3
  .select("#graphic2")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [-width / 2, -height / 2, width, height])
  .attr("font-family", "sans-serif")
  .attr("text-anchor", "middle")
  .attr("font-size", "0.7em");

let arcs90 = pie(data[1990]);
arcs90.forEach(function(d) {
  d.rad = d.data.hdi*(outerRad - innerRad) + innerRad;
  d.midAngle = (d.startAngle + d.endAngle) / 2;
});

var path90 = svg90.selectAll("path")
  .data(arcs90)
  .join("path")
    .attr("fill", d => color(d.data.group))
    .attr("fill-opacity", 0.7)
    .attr("d", d => arc.outerRadius(d.rad)(d))
    .each(function(d) { this._current = d; });

let title90 = svg90.append("g")
  .attr("font-size", "2em")
  .attr("font-weight", "bold")
  //.attr("transform", d => `translate(${width/2, height/2})`)
title90.append("text")
  .attr("y", "-0.4em")
  .text("1990")
title90.append("text")
  .attr("y", "0.7em")
  .text("HDI");