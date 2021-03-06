d3.csv("MPI/MPI_region_contributions.csv").then(function(regions) {
  d3.csv("MPI/MPI_country_contributions.csv").then(function(countries) {
    d3.csv("MPI/MPI_subnational_contributions.csv").then(function(subnational) {

      let ind = Object.keys(countries[0]).slice(11, 21);
      let max_MPI = 0.711

      regions = regions.map(function(d) {
        d["Headcount"] = +d["Headcount"];
        for (var i in ind) {
          d[ind[i]] = d[ind[i]] ? +d[ind[i]] : 0.0;
        }
        return d;
      }).sort((a, b) => a["Headcount"] < b["Headcount"] ? 1: -1);

      countries = countries.map(function(d) {
        d["Multidimensional Poverty Index (MPI)"] = +d[
          "Multidimensional Poverty Index (MPI)"
        ];
        for (var i in ind) {
          d[ind[i]] = d[ind[i]]
            ? +d[ind[i]] * d["Multidimensional Poverty Index (MPI)"]
            : 0.0;
        }
        return d;
      });

      subnational = subnational.map(function(d) {
        d["MPI of the region"] = +d[
          "MPI of the region"
        ];
        for (var i in ind) {
          d[ind[i]] = d[ind[i]]
            ? +d[ind[i]] * d["MPI of the region"]
            : 0.0;
        }
        return d;
      });

      colors = [
        "#962c20", "#632524", "#c5a9ab", "#a58580", "#adc6d6",
        "#7e9eb3", "#5d8099", "#416680", "#154b66", "#003650"
      ];

      scaleBandStep = function(d, r, step, p) {
        var n = d.length,
          reverse = r[1] < r[0];
        var mid = 0.5 * (r[0] + r[1]);
        return d3
          .scaleBand()
          .domain(d)
          .range([mid - 0.5 * (n + p) * step, mid + 0.5 * (n + p) * step])
          .padding(p);
      };

      var series = d3.stack().keys(Object.keys(regions[0]).slice(2))(regions);

      const margin = { top: 30, right: 100, bottom: 30, left: 10 };
      let width = 1100, height = 600;

      x = d3
        .scaleBand()
        .domain(["regions", "countries", "subnational"])
        .range([margin.left, width - margin.right])
        .paddingInner(0.1);

      x_regions = d3
        .scaleLinear()
        .domain([0, max_MPI]) //d3.max(series, d => d3.max(d, d => d[1]))])
        .range([x("regions"), x("regions") + x.bandwidth()]);

      y_range = [height - margin.bottom, margin.top];
      y_regions = scaleBandStep(regions.map(d => d.region), y_range, 20, 0.1);

      color = d3
        .scaleOrdinal()
        .domain(series.map(d => d.key))
        .range(colors)
        .unknown("#ccc");

      svg = d3
        .select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("font-family", "sans-serif, system-ui")
        .attr("font-size", "11");
      
      let lpad = Math.min(width/11, 10)
      let x_legend = d3.scaleBand()
        .domain(d3.range(10))
        .range([lpad, width - lpad])
        .paddingInner(0.5);

      // BACKGROUND
      svg.append("rect").attr("width", width).attr("height", height).attr("fill", "#eee");

      svg.append("text").attr("x", margin.left)
        .attr("y", 20)
        .text('Contribution of deprivation in each indicator to overall multidimensional poverty');
      svg.append("text").attr("x", margin.left)
        .attr("y", 33)
        .text('Percent values represent incidence of multidimensional poverty');

      let legend = svg.append("g");

      legend.selectAll("text")
        .data(ind)
        .enter()
        .append("text")
          .attr("x", (d, i) => x_legend(i) + x_legend.bandwidth()/2)
          .attr("y", height - 20)
          .attr("font-family", "system-ui")
          .attr("font-size", "11")
          .attr("text-anchor", "middle")
          .text(d => d);

      legend.selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
          .attr("x", (d, i) => x_legend(i))
          .attr("y", height - 50)
          .attr("width", x_legend.bandwidth())
          .attr("height", 10)
          .attr("fill", d => d);

      let titles = svg.append("g")
        .attr("font-family", "system-ui")
        .attr("font-size", "16")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")

      let incidences = svg.append("g")
        .attr("font-family", "system-ui")
        .attr("font-size", "14")
        .attr("text-anchor", "middle")

      titles
        .append("text")
        .attr("x", x("regions") + x.bandwidth() / 2)
        .attr("y", y_regions(regions[0].region) - 40)
        .text("Developing regions");

      incidences
        .append("text")
        .attr("x", x("regions") + x.bandwidth() / 2)
        .attr("y", y_regions(regions[0].region) - 20)
        .text("23.1%");

      let rtitle = titles.append("text"),
          stitle = titles.append("text").attr("x", x("subnational") + x.bandwidth() / 2),
          rincidence = incidences.append("text"),
          sincidence = incidences.append("text").attr("x", x("subnational") + x.bandwidth() / 2);

      let cf_clip = svg
        .append("clipPath")
        .attr("id", "cf-clip")
        .append("rect")
        .attr("x", margin.left)
        .attr("y", 0)
        .attr("width", width - margin.left)
        .attr("height", height);

      let sf_clip = svg
        .append("clipPath")
        .attr("id", "sf-clip")
        .append("rect")
        .attr("x", margin.left)
        .attr("y", 0)
        .attr("width", width - margin.left)
        .attr("height", height);

      let current_region, current_country;

      let g_subnational = svg.append("g");

      let countries_funnel = svg
        .append("path")
        .attr("fill", "orange")
        .attr("fill-opacity", 0.4)
        .attr("clip-path", "url(#cf-clip)");

      let subnational_funnel = g_subnational
        .append("path")
        .attr("fill", "orange")
        .attr("fill-opacity", 0.4)
        .attr("clip-path", "url(#sf-clip)");

      let g_countries = svg.append("g");

      let g_regions = svg
        .append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => color(d.key));

      g_regions
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("y", (d, i) => y_regions(d.data.region))
        .attr("x", d => x_regions(d[0]))
        .attr("width", d => x_regions(d[1]) - x_regions(d[0]))
        .attr("height", y_regions.bandwidth())
         
        .on("click", d => chart_countries(d));

      g_regions
        .filter(d => d.index == series.length - 1)
        .selectAll("text")
        .data(d => d)
        .join("text")
        .attr("font-family", "sans-serif")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "11")
        .attr("fill", "black")
        .attr(
          "y",
          (d, i) => y_regions(d.data.region) + y_regions.bandwidth() / 2
        )
        .attr("x", d => x_regions(d[1]) + 5)
        .text(d => d.data.region)
        .style("cursor", "pointer")
        .on("click", d => chart_countries(d));

      function chart_countries(d) {
        //console.log(d);
        region = d.data.region;
        if (region === current_region) {return;}
        current_region = region;

        g_subnational.attr("visibility", "hidden");
        stitle.text("");
        sincidence.text("");

        let cdata = countries.filter(c => c);

        let rcountries = countries
          .filter(c => c["World region"] == d.data.region)
          .sort((a, b) =>
            a["Multidimensional Poverty Index (MPI)"] <
            b["Multidimensional Poverty Index (MPI)"]
              ? 1
              : -1
          );

        let cseries = d3
          .stack()
          .keys(Object.keys(rcountries[0]).slice(11, 21))(rcountries);

        x_countries = d3
          .scaleLinear()
          .domain([
            0, 100*max_MPI
          ])
          .range([x("countries"), x("countries") + x.bandwidth()]);

        y_countries = scaleBandStep(
          rcountries.map(d => d.Country),
          y_range,
          10,
          0.1
        );

        rtitle
          .attr("x", x("countries") + x.bandwidth() / 2)
          .attr("y", y_countries(rcountries[0].Country) - 40)
          .text(d.data.region);

        rincidence
          .attr("x", x("countries") + x.bandwidth() / 2)
          .attr("y", y_countries(rcountries[0].Country) - 20)
          .text(d.data.Headcount + '%');

        x0 = [x_regions(d[1]), x_regions(0) + x.bandwidth() + x.paddingInner()/2, x_countries(0)];
        y0 = [
          y_regions(d.data.region),
          y_regions(d.data.region),
          y_countries.range()[0]
        ];
        y1 = [
          y_regions(d.data.region) + y_regions.bandwidth(),
          y_regions(d.data.region) + y_regions.bandwidth(),
          y_countries.range()[1]
        ];

        pts = x0.map((e, i) => [e, y0[i], y1[i]]);

        countries_funnel.datum(pts).attr(
          "d",
          d3
            .area()
            .curve(d3.curveMonotoneX)
            .x(d => d[0])
            .y0(d => d[1])
            .y1(d => d[2])
        );

        cts = g_countries
          .selectAll("g")
          .data(cseries)
          .join("g")
          .attr("fill", d => color(d.key));

        cbars = cts
          .selectAll("rect")
          .data(c => c)
          .join("rect")
          .attr("y", (c, i) => y_countries(c.data.Country))
          .attr("x", c => x_countries(0)) //d[0]))
          .attr("width", 0) //d => x_countries(d[1]) - x_countries(d[0]))
          .attr("height", y_countries.bandwidth())
          .style("cursor", "pointer")
          .on("click", d => chart_subnational(d));

        cts
          .filter(d => d.index == cseries.length - 1)
          .selectAll("text")
          .data(d => d)
          .join("text")
          .attr("font-family", "sans-serif")
          .attr("alignment-baseline", "middle")
          .attr("font-size", "10")
          .attr("fill", "black")
          .attr(
            "y",
            (d, i) =>
              y_countries(d.data.Country) + 1 + y_countries.bandwidth() / 2
          )
          .attr("x", d => x_countries(d[1]) + 5)
          .text(d => d.data.Country)
          .style("cursor", "pointer")
          .on("click", d => chart_subnational(d));

        cf_clip.attr("x", x_regions(d[1])).attr("width", 0);
        cf_clip
          .transition()
          .duration(500)
          .attr("width", x_countries(0) - x_regions(d[1]))
          .ease(d3.easeQuadInOut)
          .on("end", function() {
            cbars
              .transition()
              .duration(500)
              .attr("width", d => x_countries(d[1]) - x_countries(d[0]))
              .attr("x", d => x_countries(d[0]));
          });
      }

      function chart_subnational(d) {
        //console.log(d);
        let country = d.data.Country;
        if (country === current_country) {return;}
        current_country = country;

        g_subnational.attr("visibility", "visible");

        var csubnational = subnational
          .filter(c => c["Country"] == country)
          .sort((a, b) =>
            a["MPI of the region"] <
            b["MPI of the region"]
              ? 1
              : -1
          );

        if(csubnational.length == 0) {
          g_subnational.attr("visibility", "hidden");
          stitle.attr("y", height/2 - 40).text(d.data.Country + ' (' + d.data.Year + ')');
          sincidence.attr("y", height/2 - 20).text("No subnational data available")
          return;
        }
        var sseries = d3
          .stack()
          .keys(Object.keys(csubnational[0]).slice(12, 22))(csubnational);

        x_subnational = d3
          .scaleLinear()
          .domain([
            0, 100*max_MPI
          ])
          .range([x("subnational"), x("subnational") + x.bandwidth()]);

        y_subnational = scaleBandStep(
          csubnational.map(d => d['Subnational region']),
          y_range,
          10,
          0.1
        );
        stitle
          .attr("x", x("subnational") + x.bandwidth() / 2)
          .attr("y", y_subnational(csubnational[0]['Subnational region']) - 40)
          .text(d.data.Country + ' (' + d.data.Year + ')');;

        sincidence
          .attr("x", x("subnational") + x.bandwidth() / 2)
          .attr("y", y_subnational(csubnational[0]['Subnational region']) - 20)
          .text(d.data.Headcount + '%');

        x0 = [x_countries(d[1]), x_countries(0) + x.bandwidth(), x_subnational(0)];
        y0 = [
          y_countries(country),
          y_countries(country),
          y_subnational.range()[0]
        ];
        y1 = [
          y_countries(country) + y_countries.bandwidth(),
          y_countries(country) + y_countries.bandwidth(),
          y_subnational.range()[1]
        ];

        pts = x0.map((e, i) => [e, y0[i], y1[i]]);

        subnational_funnel.datum(pts).attr(
          "d",
          d3
            .area()
            .curve(d3.curveMonotoneX)
            .x(d => d[0])
            .y0(d => d[1])
            .y1(d => d[2])
        );

        sbn = g_subnational
          .selectAll("g")
          .data(sseries)
          .join("g")
          .attr("fill", d => color(d.key));

        sbars = sbn
          .selectAll("rect")
          .data(c => c)
          .join("rect")
          .attr("y", (c, i) => y_subnational(c.data['Subnational region']))
          .attr("x", c => x_subnational(0)) //d[0]))
          .attr("width", 0) //d => x_countries(d[1]) - x_countries(d[0]))
          .attr("height", y_subnational.bandwidth());

        sbn
          .filter(d => d.index == sseries.length - 1)
          .selectAll("text")
          .data(d => d)
          .join("text")
          .attr("font-family", "sans-serif")
          .attr("alignment-baseline", "middle")
          .attr("font-size", "10")
          .attr("fill", "black")
          .attr(
            "y",
            (d, i) =>
              y_subnational(d.data['Subnational region']) + 1 + y_subnational.bandwidth() / 2
          )
          .attr("x", d => x_subnational(d[1]) + 5)
          .text(d => d.data['Subnational region']);

        sf_clip.attr("x", x_countries(d[1])).attr("width", 0);
        sf_clip
          .transition()
          .duration(500)
          .attr("width", x_subnational(0) - x_countries(d[1]))
          .ease(d3.easeQuadInOut)
          .on("end", function() {
            sbars
              .transition()
              .duration(500)
              .attr("width", d => x_subnational(d[1]) - x_subnational(d[0]))
              .attr("x", d => x_subnational(d[0]));
          });
      }
    });
  });
});