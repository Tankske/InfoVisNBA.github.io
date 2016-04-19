function drawTs(data, team, year, div, x, y, width, height) {

    d3.select(".smallmultiple").remove();

    var bases = ['srs', 'srs', 'srs'];

    var x = d3.scale.linear()
    .range([0, width/bases.length])
        .domain([1971,2015]);

    var srsScale = d3.scale.linear()
        .range([height, 0])
        .domain([-10,10]);

    var srsline = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return srsScale(d.val); });

    console.log(data);
    srsData = []
    data.forEach(function (d) {
        var theTeam = d.teams.filter(function (d) { return d.team == team; }); 
        if (theTeam.length > 0) {
            srsData.push({year : d.year,
                val : theTeam[0].srs });
        }
    });

    var svg = div.selectAll("svg")
                    .data(bases)
                    .enter().append("svg")
                        .attr("width", width/bases.length)
                        .attr("height", height)
                        .attr("class", "smallmultiple");

    console.log(svg);

    svg.append("path")
        .datum(srsData)
        .attr("class", "line")
        .attr("d", srsline);

    svg.append("text")
        .attr("x", (width / (2 * bases.length)))
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("SRS");

    var highlightYear = year;

    div.on("mouseout", function() {
        highlightYear = year;
        fixcyline();
        drawBubbles(miniBubbleSvg, 0, 0, miniw, minih, highlightYear, true);
        drawZoom(zoomSvg, 0, 0, width, height - 280, highlightYear, team);
    });

    svg.on("mousemove", function() {
        highlightYear = Math.round(x.invert(d3.mouse(this)[0]));
        fixcyline();
        drawBubbles(miniBubbleSvg, 0, 0, miniw, minih, highlightYear, true);
        drawZoom(zoomSvg, 0, 0, width, height - 280, highlightYear, team);
    });

    function fixcyline() {
        d3.select(".curYearLine")
            .attr("x1", x(highlightYear))
            .attr("y1", height)
            .attr("x2", x(highlightYear))
            .attr("y2", srsScale(srsData.find(function(d) { return d.year == highlightYear; }).val));

        d3.select(".curYearVal")
            .attr("x", x(highlightYear))
            .attr("y", srsScale(srsData.find(function(d) { return d.year == highlightYear; }).val))
            .text(srsData.find(function(d) { return d.year == highlightYear; }).val);

        d3.select(".curYearName")
            .attr("x", x(highlightYear))
            .attr("y", height - 10)
            .text(highlightYear);

    }

    svg.selectAll("svg").append("line")
        .attr("class", "curYearLine");

    svg.append("text")
        .attr("class", "curYearVal")
        .attr("text-anchor", "middle");

    svg.append("text")
        .attr("class", "curYearName")
        .attr("text-anchor", "middle");
        

    fixcyline();
} 
