
const a = [
  {
    type: d3.annotationCalloutCircle,
    note: {
      title: "Pittsburgh"
    },
    code: "42003",
    dx: -10,
    dy: -80
  },
  {
    type: d3.annotationCalloutCircle,
    note: {
      title: "New York"
    },
    code: "36081",
    dx: 80,
    dy: 50
  },
  {
    type: d3.annotationCalloutCircle,
    note: {
      title: "Houston"
    },
    code: "48201",
    dx: 40,
    dy: 40
  },
  {
    type: d3.annotationCalloutCircle,
    note: {
      title: "Philadelphia"
    },
    code: "42101",
    dx: 60,
    dy: 70
  },
  {
    type: d3.annotationCalloutCircle,
    note: {
      title: "Miami"
    },
    code: "12086",
    dx: 20,
    dy: -50
  }
]

completed = ['01001', '01019', '01033', '01045', '01049', '01057', '01059',
             '01071', '01107', '01109', '01129', '05005', '05009', '05027',
             '05037', '05057', '05061', '05071', '05085', '05089', '05095',
             '05111', '05115', '05125', '05123', '05137', '05141', '05045',
             '05069', '06087', '06087', '08005', '08013', '08014', '08039',
             '08119', '12001', '12007', '12019', '12027', '12033', '12033',
             '12041', '12043', '13113', '13135', '13107', '13185', '13097',
             '13115', '13187', '13103', '17203', '18023', '18029', '18053',
             '18057', '18063', '18071', '18135', '18137', '18143', '18149',
             '18163', '18175', '19013', '19033', '19045', '19079', '19021',
             '19141', '19119', '19167', '19143', '19149', '19153', '19163',
             '19193', '19059', '19195', '20013', '20017', '20021', '20031',
             '20035', '20055', '20085', '20151', '20155', '20163', '20169',
             '20181', '20191', '20193', '20195', '20207', '20209', '20087',
             '20147', '21001', '21003', '21007', '21013', '21115', '21015',
             '21027', '21029', '21041', '21051', '21085', '21093', '21111',
             '21151', '21173', '21195', '21207', '21235', '21239', '21031',
             '21047', '21133', '21219', '21009', '21017', '21019', '21021',
             '21033', '21035', '21037', '21043', '21045', '21049', '21055',
             '21059', '21073', '21075', '21081', '21089', '21095', '21099',
             '21101', '21107', '21109', '21113', '21117', '21121', '21123',
             '21125', '21131', '21135', '21137', '21141', '21155', '21161',
             '21145', '21177', '21179', '21183', '21185', '21199', '21203',
             '21205', '21209', '21211', '21213', '21217', '21129', '21225',
             '21227', '21231', '21233', '22033', '22061', '22001', '22003',
             '22021', '22023', '22029', '22037', '22047', '22049', '22053',
             '22065', '22067', '22069', '22077', '22103', '22081', '22083',
             '22085', '22095', '22101', '22107', '22117', '22125', '22127',
             '22007', '22093', '22057', '22089', '22109', '26163', '26163',
             '26163', '27005', '27007', '27013', '27023', '27015', '27017',
             '27033', '27035', '27045', '27049', '27055', '27059', '27067',
             '27071', '27073', '27079', '27085', '27095', '27097', '27099',
             '27103', '27113', '27115', '27117', '27127', '27129', '27131',
             '27135', '27139', '27167', '27169', '27171', '27173', '28081',
             '28025', '28067', '28069', '28133', '28143', '29009', '29031',
             '29117', '29101', '29109', '29141', '29209', '30031', '30093',
             '30047', '30087', '32003', '34011', '34019', '34037', '35001',
             '35025', '37023', '38105', '38101', '39005', '39025', '39041',
             '39043', '39063', '39099', '39129', '39027', '39053', '39013',
             '39049', '39049', '39059', '39061', '39061', '39061', '39077',
             '39083', '39107', '39117', '39123', '39143', '40031', '40125',
             '40023', '40037', '40097', '40087', '40111', '40117', '40131',
             '40145', '45007', '48331', '48395', '48445', '48451', '55033']

const width = 960;
const height = 600;
let margin = 50;
const path = d3.geoPath();
const formatNumber = d3.format(",.0f");
const radius = d3.scaleSqrt().domain([0, 2e3]).range([0, 15]);
const colors = [
  "#f6f6f4",
  "#f1f3f1",
  "#cad2d3",
  "#b1b1b1",
  "#6b6b6b"
]
const color = d3.scaleOrdinal(d3.schemeCategory10);

const modes = {
  PRIOR: {
    title: "Recent Studies Utilized Data From Five Large, Urban Counties...",
    display: "none",
    color: "#ffb347"
  },
  ALL: {
    title: "...But Those Five Are a Tiny Slice of the Inmate Population",
    display: "inherit",
    color: "#ffb347"
  },
  PROGRESS: {
    title: "Our Progress So Far",
    display: "inherit",
    color: "#2ca02c"
  }
}

mode = modes.PROGRESS;
const five_largest = a.map(d => d.code);
let title = d3.select(".title")
title.text(mode.title);

const svg = d3.select("svg")
    .style("width", "100%")
    .style("height", "auto");

/*svg.append("text")
  .attr("x", width)
  .attr("y", 50)
  .attr("text-anchor", "end")
  .text("Capacities of Local Jail Systems (2013 Census of Jails)");*/

d3.json("https://unpkg.com/us-atlas@1/us/10m.json").then(function(us) {

  let map = svg.append("g");

  map.append("path")
    .datum(topojson.feature(us, us.objects.nation))
    .attr("fill", colors[1])
    .attr("d", path);

  map.append("path")
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke", colors[3])
    .attr("stroke-linejoin", "round")
    .attr("d", path);

  const legend = map.append("g")
    .attr("fill", "#777")
    .attr("transform", `translate(${width - 50},${height - 2})`)
    .attr("text-anchor", "middle")
    .style("font", "10px sans-serif")
    .selectAll("g")
    .data([1e3, 5e3, 1e4])
    .join("g");

  legend.append("circle")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("cy", d => -radius(d))
    .attr("r", radius);

  legend.append("text")
    .attr("y", d => -2 * radius(d))
    .attr("dy", "1.3em")
    .text(d3.format(".1s"));

  const bar = map.append("g")
    .attr("display", mode.display)

  d3.csv('JDI_BJS_capacity.csv').then(function(data) {
    //console.log(data);
    data.forEach(d => d.facility_capacity = +d.facility_capacity);
    let counties = topojson.feature(us, us.objects.counties).features;
    counties
      .forEach(function(d) {
        let jail = data.filter(c => c.CNTYCODE == d.id);
        d.population = jail.length > 0 ? jail[0].facility_capacity : 0;
        d.facility = jail.length > 0 ? jail[0].facility_name : '';
    });
    data = data.sort((a,b) => b.CAPACITY - a.CAPACITY);
    map.append("g")
        .attr("fill-opacity", 0.5)
        .attr("stroke-width", 0.5)
      .selectAll("circle")
      .data(counties.sort((a, b) => b.population - a.population))
      .join("circle")
        .attr("display", d => five_largest.includes(d.id) ? "inherit" : mode.display)
        .attr("fill", d => completed.includes(d.id) ? mode.color : "#ffb347")
        .attr("stroke", d => five_largest.includes(d.id) ? "#fff" : "#fff")
        .attr("transform", d => `translate(${path.centroid(d)})`)
        .attr("r", d => radius(d.population))
        .on("mouseover", function(d) {
          tooltip
            .attr("transform", `translate(${path.centroid(d)})`)
            .call(callout, `${d.facility}`);
        })
        .on("mouseout", function(d) {
          tooltip.call(callout, null);
        })
      .append("title")
        .text(d => formatNumber(d.population));

    a.forEach(function(d) {
      let cnty = counties.filter(c => c.id == d.code)[0];
      let c = path.centroid(cnty);
      d.x = c[0];
      d.y = c[1];
      d.subject = {
        radius: radius(cnty.population)
      }
    })

    /*const makeAnnotations = d3.annotation()
      .type(d3.annotationLabel)
      .annotations(a)

    map.append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations);*/

    const y = d3.scaleLinear()
      .domain([0, data.length])
      .range([height - margin, margin]);

    bardata = [
      {
        text: 'Jails in BJS Census',
        opacity: 0.2,
        number: data.length,
        color: "#ffb347",
        mid: data.length - (data.length - 1028)/2,
        display: "inherit"
      },
      {
        text: 'Scrapable',
        opacity: 1,
        number: 1028,
        color: "#ffb347",
        mid: 1028 - (1028 - completed.length)/2,
        display: "inherit"
      },
      {
        text: 'Completed',
        opacity: 1,
        number: completed.length,
        color: mode.color,
        mid: completed.length/2,
        display: mode == modes.PROGRESS ? "inherit" : "none"
      }
    ];

    bar.selectAll("rect")
      .data(bardata)
      .join("rect")
        .attr("x", width + margin)
        .attr("y", d => y(d.number))
        .attr("width", 15)//d => x(d.number))
        .attr("height", d => height - y(d.number))
        .attr("fill", d => d.color)
        .attr("fill-opacity", d => d.opacity);

    bar.selectAll("text")
      .data(bardata)
      .join("text")
        .attr("x", width + margin + 25)
        .attr("y", d => y(d.number) + 5)
        .text(d => `${d.number} ${d.text}`)
        .attr("display", d => d.display)
        .attr("text-anchor", "start");

    bar.selectAll("line")
      .data(bardata)
      .join("line")
        .attr("x1", width + margin - 5)
        .attr("y1", d => y(d.number))
        .attr("x2", width + margin + 20)
        .attr("y2", d => y(d.number))
        .attr("stroke-width", 1)
        .attr("display", d => d.display)
        .attr("stroke", "black");

    const tooltip = svg.append("g");

  });
})

callout = (g, value) => {
  if (!value) return g.style("display", "none");

  g
      .style("display", null)
      .style("pointer-events", "none")
      .style("font", "10px sans-serif");

  const path = g.selectAll("path")
    .data([null])
    .join("path")
      .attr("fill", "white")
      .attr("stroke", "black");

  const text = g.selectAll("text")
    .data([null])
    .join("text")
    .call(text => text
      .selectAll("tspan")
      .data((value + "").split(/\n/))
      .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i) => `${i * 1.1}em`)
        .style("font-weight", (_, i) => i ? null : "bold")
        .text(d => d));

  const {x, y, width: w, height: h} = text.node().getBBox();

  text.attr("transform", `translate(${-w / 2},${15 - y})`);
  path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
}
