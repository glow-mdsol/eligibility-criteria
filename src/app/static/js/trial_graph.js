function drawGraphForTrial(uri, id) {
    $("#graph").empty();
    $("#loading").show();
    
    $.get('/graph', {'type': 'trials', 'uri': uri, 'id': id }, function(data) {
                $("#loading").hide();
                if (data.graph.links.length > 0) {
                        drawTrialGraph(data.graph);
                } else {
                        $("#noresponse").show();        
                }
    });
}


function drawTrialGraph(graph) {
  var width = 900,
      height = 900;
  
  var color = d3.scale.category10();
  
  var force = d3.layout.force()
      .charge(-120)
      .linkDistance(20)
      .size([width, height]);
  
  var svg = d3.select("#graph").append("svg")
      .attr("width", width)
      .attr("height", height);


  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll("circle.node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d) { return d.degree + 5;})
      .style("fill", function(d) { return color(d.type); })
      .on("click", function(d) { click(d); })
      .call(force.drag);

      
  node.append("title")
      .text(function(d) { return d.label; });

  var texts = svg.selectAll("text.label")
                .data(graph.nodes)
                .enter().append("text")
                .attr("class", "label")
                .attr("fill", "black")
                .style("text-anchor", "middle")
                .attr("dy", ".3em")
                .attr("class", function(d) { return d.type;})
                .text(function(d) {  if (d.type != 'criterion') { return d.label; } else { return ''; }  });
  
      

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
        
    texts.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
  });
  
  function click(n) {
        if (n.type == 'trial') {
            drawGraphForTrial(n.uri, n.label);
        }
        if (n.type == 'concept') {
            drawChordForConcept(n.uri);
        }
        
  }
}