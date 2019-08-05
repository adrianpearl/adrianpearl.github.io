d3.csv("MPI/MPI_subnational_contributions.csv").then(function(subnational) {
  d3.csv("MPI/Income_groups.csv").then(function(groups) {

    subnational.forEach(function(d) {
      d['Group'] = groups.filter(c => c.Code == d['ISO country code'])[0]['Income group'];
      d["Headcount"] = +d["Headcount"];
      d["MPI of the region"] = +d["MPI of the region"];
      d["Intensity"] = 100 * d["MPI of the region"] / (d["Headcount"] / 100);
      d["MPI_pop"] = (d["Headcount"] / 100)*+d["Population size by region"]
    });
    
    subnational = subnational.sort((a, b) => a["MPI_pop"] < b["MPI_pop"] ? 1: -1);
    const colors = [
      "#E6233C", "#C61E68", "#2ABEE2"
    ];
    const margin = { top: 80, right: 60, bottom: 20, left: 60 };
    const height = 750, width = 1100;
    const plotheight = 150
    const group_types = ["Upper middle income", "Lower middle income", "Low income"]
    const titles = [
      "Upper-middle-income countries (94 million multidimensionally poor people)",
      "Lower-middle-income countries (792 million multidimensionally poor people)",
      "Low-income countries (440 million multidimensionally poor people)"
    ]

    let y_groups = d3
      .scaleBand()
      .domain(group_types)
      .range([margin.top, height - margin.bottom])
      .paddingInner(0.1);

    const color = d3
      .scaleOrdinal()
      .domain(group_types)
      .range(colors)
      .unknown("#ccc");

    let x = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.right]);

    let y = d3
      .scaleLinear()
      .domain([25, 80])
      .range([plotheight, 0]);

    const radius = d3.scaleSqrt()
      .domain([0, d3.max(subnational.map(d => d.MPI_pop))])
      .range([0, 50]);

    let svg = d3
      .select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("font-family", "system-ui")
      .attr("font-size", "11");

    // BACKGROUND
    svg.append("rect").attr("width", width).attr("height", height).attr("fill", "#eee");

    let xAxis = (g, val) => g
      .attr("transform", `translate(0,${val + plotheight})`)
      .call(d3.axisBottom(x).ticks(10).tickSizeOuter(0));

    let yAxis = (g, val) => g
      .attr("transform", `translate(${margin.left},${val})`)
      .call(d3.axisLeft(y).ticks(5).tickSizeOuter(0))
      .call(g => g.append("text")
        .attr("fill", "#000")
        .attr("x", -10)
        .attr("y", -10)
        .attr("text-anchor", "start")
        .text("Intensity (percent)"));
    
    for (var g in group_types) {
      let grp = group_types[g], title = titles[g];

      svg.append("g")
        .call(xAxis, y_groups(grp));
      
      svg.append("g")
        .call(yAxis, y_groups(grp));

      svg.append("text")
        .attr("x", width/2)
        .attr("y", y_groups(grp))
        .attr("fill", "black")
        .attr("font-size", 12)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .text(title);
    }

    svg.append("text")
      .attr("x", width/2)
      .attr("y", height - margin.bottom)
      .attr("fill", "black")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .text('Incidence (percent)');

    let focused_country;

    let low_income = svg.append("g")
      .selectAll("circle")
      .data(subnational)
      .join("circle")
        .attr("cx", d => x(d.Headcount))
        .attr("cy", d => y_groups(d.Group) + y(d.Intensity))
        .attr("r", d => radius(d.MPI_pop))
        .attr("fill", d => color(d.Group))
        .attr("stroke", "black")
        .attr("class", "default")
        .on("mouseover", function(d) {
          tooltip
            .attr("transform", `translate(${x(d.Headcount)},${y_groups(d.Group) + y(d.Intensity)})`)
            .call(callout, `${d["Subnational region"]}, ${d.Country}`);
          if (focused_country == d.Country) {return;}
          low_income.filter(c => c.Country == d.Country)
            .attr("class", "hovering");
        })
        .on("mouseout", function(d) {
          tooltip.call(callout, null);
          if (focused_country == d.Country) {return;}
          else if (focused_country) {
            low_income.filter(c => c.Country == d.Country)
              .attr("class", "unfocused");
          } else{
            low_income.filter(c => c.Country == d.Country)
              .attr("class", "default");
          }
        })
        .on("click", function(d) {
          focused_country = d.Country;
          low_income
            .attr("class", c => c.Country == d.Country ? "focused" : "unfocused")
        });
    
    const tooltip = svg.append("g");

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
  });
});