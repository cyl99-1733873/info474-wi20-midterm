"use strict";
(function(){
    let data = ""
    let svgContainer = ""
    // dimensions for svg
    const measurements = {
        width: 1200,
        height: 600,
        marginAll: 50
    }

    let color = d3.scaleOrdinal()
      .domain(["Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire", "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock", "Steel", "Water"])
      .range(["#4E79A7", "#A0CBE8", "#FFA64D", "#F28E2B", "#FFBE7D", "#59A14F", "#8CD17D", "#B6992D", "#499894", "#86BCB6", "#FABFD2", "#E15759", "#FF9D9A", "#79706E", "#CCCCCC", "#BAB0AC", "#D37295"])

      const colors = {

        "Bug": "#4E79A7",

        "Dark": "#A0CBE8",

        "Electric": "#F28E2B",

        "Fairy": "#FFBE7D",

        "Fighting": "#59A14F",

        "Fire": "#8CD17D",

        "Ghost": "#B6992D",

        "Grass": "#499894",

        "Ground": "#86BCB6",

        "Ice": "#FABFD2",

        "Normal": "#E15759",

        "Poison": "#FF9D9A",

        "Psychic": "#79706E",

        "Steel": "#BAB0AC",

        "Water": "#D37295"

    }

    let legendarySelection = d3.select('#legendary-selector').node().value;
    let generationSelection = d3.select('#legendary-selector').node().value;

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

        makeFilterSelection(scaleX, scaleY)

        makeLegend()
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

    function makeFilterSelection(scaleX, scaleY) {
      const xMap = function(d) { return scaleX(+d["Sp. Def"]) }
      const yMap = function(d) { return scaleY(+d["Total"]) }

      let div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

      d3.select("#generation-selector")
        .on("change",function(d){
          svgContainer.selectAll("circle").remove()
          let selectedGeneration = d3.select("#generation-selector").node().value;
          let selectedLegendary = d3.select("#legendary-selector").node().value;
          svgContainer.selectAll(".circle")
              .data(data)
              .enter()
              .append('circle')
              .filter(function(d) {
                if (selectedGeneration == "All") {
                  return d
                } else {
                    return d["Generation"] == parseInt(selectedGeneration)
                }
              })
              .filter(function(d) {
                if (selectedLegendary == "All") {
                  return d;
                } else {
                    return d["Legendary"] == selectedLegendary
                }
              })
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

      d3.select("#legendary-selector")
        .on("change",function(d){
          let selectedGeneration = d3.select("#generation-selector").node().value;
          let selectedLegendary = d3.select("#legendary-selector").node().value;
          svgContainer.selectAll(".circle")
              .data(data)
              .enter()
              .append('circle')
              .filter(function(d) {
                if (selectedGeneration == "All") {
                  return d
                } else {
                    return d["Generation"] == parseInt(selectedGeneration)
                }
              })
              .filter(function(d) {
                if (selectedLegendary == "All") {
                  return d;
                } else {
                    return d["Legendary"] == selectedLegendary
                }
              })
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

    function makeLegend() {
      let legend = document.createElement("div");
      legend.id = "legend";
      document.body.appendChild(legend);
      let container = document.getElementById("legend");

      for (let key in colors) {
          let boxContainer = document.createElement("div");
          let box = document.createElement("div");
          let label = document.createElement("span");

          label.innerHTML = key;
          box.className = "box";
          box.style.backgroundColor = colors[key];

          boxContainer.appendChild(box);
          boxContainer.appendChild(label);

          container.appendChild(boxContainer);

     }
   }

})()
