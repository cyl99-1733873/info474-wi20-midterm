"use strict";
(function(){
    let data = ""
    let svgContainer = ""
    // dimensions for svg
    const measurements = {
        width: 1000,
        height: 600,
        marginAll: 50
    }

    let color = d3.scaleOrdinal()
      .domain(["Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire", "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock", "Steel", "Water"])
      .range(["#4E79A7", "#A0CBE8", "#FFA64D", "#F28E2B", "#FFBE7D", "#59A14F", "#8CD17D", "#B6992D", "#499894", "#86BCB6", "#FABFD2", "#E15759", "#FF9D9A", "#79706E", "#CCCCCC", "#BAB0AC", "#D37295"])

    let legendarySelection = "All";
    let generationSelection = "All";

    // load data and append svg to body
    svgContainer = d3.select('body').append("svg")
        .attr('width', measurements.width)
        .attr('height', measurements.height);
    d3.csv("pokemon.csv")
        .then((csvData) => data = csvData)
        .then(() => makeScatterPlot())

    function makeScatterPlot() {
        // get arrays of GRE Score and Chance of Admit
        let spDef = data.map((row) => parseInt(row["Sp. Def"]))
        let total = data.map((row) =>  parseFloat(row["Total"]))
        let colorValue = data.map((row) =>  parseFloat(row["Type 1"]));
        // find range of data
        const limits = findMinMax(spDef, total)
        // create a function to scale x coordinates
        let scaleX = d3.scaleLinear()
            .domain([limits.xMin - 5, limits.xMax])
            .range([0 + measurements.marginAll, measurements.width - measurements.marginAll])
        // create a function to scale y coordinates
        let scaleY = d3.scaleLinear()
            .domain([limits.yMax, limits.yMin - 0.05])
            .range([0 + measurements.marginAll, measurements.height - measurements.marginAll])

        drawAxes(scaleX, scaleY)

        plotData(scaleX, scaleY)

        makeFilterSelection(scaleX, scaleY, legendarySelection, generationSelection)
    }

    function findMinMax(x, y) {
        return {
            xMin: d3.min(x),
            xMax: d3.max(x),
            yMin: d3.min(y),
            yMax: d3.max(y)
        }
    }

    function drawAxes(scaleX, scaleY) {
        // these are not HTML elements. They're functions!
        let xAxis = d3.axisBottom()
            .scale(scaleX)

        let yAxis = d3.axisLeft()
            .scale(scaleY)

        // append x and y axes to svg
        svgContainer.append('g')
            .attr('transform', 'translate(0, 550)')
            .call(xAxis)

        svgContainer.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(yAxis)
    }

    function plotData(scaleX, scaleY) {
        const xMap = function(d) { return scaleX(+d["Sp. Def"]) }
        const yMap = function(d) { return scaleY(+d["Total"]) }

        let div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // svgContainer.selectAll(".circle")
        //     .data(data)
        //     .enter()
        //     .append('circle')
        //         .attr('cx', xMap)
        //         .attr('cy', yMap)
        //         .attr('r', 4)
        //         .style("fill", function (d) { return color(d["Type 1"]) })
        //         .on("mouseover", function(d) {
        //            div.transition()
        //                .duration(200)
        //                .style("opacity", .8);
        //            div.html(d["Name"] + "<br/>" + d["Type 1"] + "<br/>" + d["Type 2"])
        //               .style("left", (d3.event.pageX) + "px")
        //               .style("top", (d3.event.pageY - 28) + "px");
        //            })
        //         .on("mouseout", function(d) {
        //            div.transition()
        //                .duration(500)
        //                .style("opacity", 0);
        //         });
    }

    // function makeFilterSection() {
    //   let typeFilter = d3.select('body')
    //     .append('select')
    //     .attr('id', 'type-filter')
    //   d3.select('#type-filter')
    //     .data(colors)
    //     .enter()
    //     .append('option')
    //     .attr('value', function(d) {
    //       let keys = Object.keys(d)
    //       let key = keys[0]
    //       return d[key]
    //     })
    //     .html(function(d) {
    //       let keys = Object.keys(d)
    //       let key = keys[0]
    //       return d[key]
    //     })
    // }

    function makeFilterSelection(scaleX, scaleY, legendarySelection, generationSelection) {
      const xMap = function(d) { return scaleX(+d["Sp. Def"]) }
      const yMap = function(d) { return scaleY(+d["Total"]) }

      let div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

      d3.select("#generation-selector")
        .on("change",function(d){
          var selected = d3.select("#generation-selector").node().value;
          console.log( selected );
          svgContainer.selectAll(".circle")
              .data(data.filter(function(d) {return d["Generation"] == parseInt(1)}))
              .enter()
              .append('circle')
                  .attr('cx', xMap)
                  .attr('cy', yMap)
                  .attr('r', 4)
                  .style("fill", function (d) { return color(d["Type 1"]) })
                  .on("mouseover", function(d) {
                     div.transition()
                         .duration(200)
                         .style("opacity", .8);
                     div.html(d["Name"] + "<br/>" + d["Type 1"] + "<br/>" + d["Type 2"])
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                     })
                  .on("mouseout", function(d) {
                     div.transition()
                         .duration(500)
                         .style("opacity", 0);
                  });
      })
    }

})()
