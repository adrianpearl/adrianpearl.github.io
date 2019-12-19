
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

completed = ['05143', '12001', '26163', '05045', '48451', '28069', '40087',
             '05069', '05085', '05125', '18071', '40131', '22101', '40037',
             '01001', '01071', '40023', '18143', '22053', '01049', '29101',
             '22117', '01009', '05115', '22047', '48331', '01059', '01019',
             '01107', '05005', '05141', '39053', '40145', '29141', '29109',
             '48445', '20021', '05009', '05123', '05027', '05057', '22003',
             '05111', '28025', '53067', '40097', '01109', '29209', '01045',
             '05037', '01057', '29009', '20195', '05089', '05061', '05137',
             '20087', '30007', '29117', '20191', '28143', '48395', '20085',
             '20055', '22023', '05095', '01033', '40111', '20181', '20031',
             '27013', '01129', '20013', '27131', '41041', '20207', '41053',
             '39117', '30093', '27049', '27017', '27015', '30047', '19195',
             '35025', '27031', '19059', '19079', '41001', '16031', '16069',
             '19141', '16013', '19033', '18019', '53039', '53001', '53075',
             '39027', '19021', '31111', '20035', '30029', '30087', '34019',
             '35025', '30025', '24023', '41025', '12003', '08039', '39139',
             '16019', '22017', '49045', '45031', '27023', '47157', '49035',
             '45021', '49011', '20041', '53073', '17091', '13121', '17091',
             '56003', '45063', '53057', '42043', '45043', '37067', '34003',
             '34029', '41019', '53029', '22009', '41071', '08045', '16027',
             '53049', '46099', '19153', '04001', '12123', '22079', '37081',
             '13039', '24033', '34033', '41059', '56023', '06089', '06005',
             '21219', '16087', '12007', '39129', '21031', '27103', '41009',
             '18057', '22097', '27099', '19119', '39013', '30081', '39099',
             '22041', '13113', '39077', '27129', '22123', '22055', '45007',
             '27067', '22099', '30031', '22029', '27097', '12043', '19193',
             '27113', '12035', '22027', '41057', '17115', '45015', '53027',
             '27167', '21177', '13033', '39049', '21083', '53027', '53061',
             '12027', '16077', '53071', '27127', '40019', '40077', '22025',
             '21015', '19149', '27085', '22007', '19169', '22013', '34005',
             '53013', '19163', '39093', '19049', '34037', '29021', '48027',
             '27117', '39083', '53027', '13103', '20163', '39043', '35009',
             '27123', '18023', '05131', '08005', '38017', '41065', '12077',
             '13135', '49005', '41003', '39025', '18053', '18163', '27079',
             '53067', '53009', '39041', '53061', '06047', '21133', '27139',
             '22033', '53061', '08035', '20151', '55079', '17203', '27007',
             '27059', '06083', '39059', '35045', '28081', '28133', '40125',
             '12131', '27035', '35001', '20193', '29095', '12107', '23005',
             '12089', '17093', '13015', '12011', '27073', '16039', '27123',
             '27169', '22059', '19045', '22039', '41007', '22015', '27135',
             '27173', '51161', '27095', '41005', '22011', '16073', '38105',
             '16011', '22093', '27045', '20017', '45055', '13121', '47157',
             '37081', '22027', '39049', '22029', '45041', '22061', '13187',
             '27055', '20061', '12041', '56015', '56029', '56027', '45067',
             '45083', '27071', '08059', '37183', '39063', '05033', '53021',
             '40117', '22057', '56037', '40031', '34011', '47037', '13097',
             '13051', '37071', '08013', '12031', '22115', '48453', '27115',
             '47065', '21085', '13107', '19143', '08014', '18029', '32003',
             '22067', '32003', '39107', '22107', '37023', '20155', '22109',
             '22095', '22031', '20169', '22045', '18135', '22077', '19013',
             '45023', '21129', '22125', '22071', '22081', '22019', '32510',
             '47093', '22089', '18095', '40005', '24019', '16001', '45007',
             '48303', '05119', '22021', '22085', '22049', '22065', '22127',
             '22083', '12113', '21111', '12033', '22069', '01073', '06087',
             '12119', '12121', '12109', '22001', '12023', '20099', '21115',
             '39061', '20209', '38101', '13115', '27033', '13185', '12115',
             '12019', '21047', '04027', '55033', '05113', '56039', '45053',
             '28067', '39005', '22005', '39143', '20147', '22075', '41043',
             '30015', '18137', '27171', '27005', '19167', '08119', '05071',
             '38015', '12075', '18063', '21137', '21121', '21135', '21043',
             '21195', '21109', '21099', '21199', '21145', '18175', '21095',
             '21205', '21217', '21059', '21213', '21141', '21117', '21225',
             '21125', '18149', '21055', '21037', '21211', '21113', '21179',
             '21107', '21207', '21089', '21093', '21081', '21185', '21045',
             '21021', '21001', '21017', '21019', '21073', '21049', '21003',
             '21131', '21183', '21033', '21029', '21041', '21161', '21233',
             '21209', '21051', '21101', '21231', '21123', '21027', '21035',
             '21007', '21075', '21009', '21203', '21155', '39123', '21173',
             '21151', '21013', '21239', '21235', '21227', '39053', '47037',
             '47037', '22019', '22115', '22079', '22015', '22009', '22009',
             '12033', '39061', '06087', '39049', '22015', '22015', '22015']

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
          console.log(d)
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

    bardata = [
      {
        text: 'Jails in BJS Census',
        opacity: 0.2,
        number: data.length,
        color: "#ffb347",
        //mid: data.length - (data.length - 1028)/2,
        display: "inherit"
      },
      {
        text: 'Scrapable',
        opacity: 1,
        number: 1028,
        color: "#ffb347",
        //mid: 1028 - (1028 - completed.length)/2,
        display: "inherit"
      },
      {
        text: 'Completed',
        opacity: 1,
        number: completed.length,
        color: mode.color,
        //mid: completed.length/2,
        display: mode == modes.PROGRESS ? "inherit" : "none"
      }
    ];

    const y = d3.scaleLinear()
      .domain([0, data.length])
      .range([0, height - margin]);

    bar.selectAll("rect")
      .data(bardata)
      .join("rect")
        .attr("x", (d, i) => width + margin)
        .attr("y", d => height - y(d.number))
        .attr("width", 15)//d => x(d.number))
        .attr("height", d => y(d.number))
        .attr("fill", d => d.color)
        .attr("fill-opacity", d => d.opacity);

    bar.selectAll("text")
      .data(bardata)
      .join("text")
        .attr("x", width + margin + 25)
        .attr("y", d => height - y(d.number) + 5)
        .text(d => `${d.number} ${d.text}`)
        .attr("display", d => d.display)
        .attr("text-anchor", "start");

    bar.selectAll("line")
      .data(bardata)
      .join("line")
        .attr("x1", width + margin - 5)
        .attr("y1", d => height - y(d.number))
        .attr("x2", width + margin + 20)
        .attr("y2", d => height - y(d.number))
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
