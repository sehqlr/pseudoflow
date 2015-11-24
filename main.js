function main() {
	drawChart(parsePseudocode())
}

function parsePseudocode() {
	var pCode = document.getElementById("pseudocode-editor").value.split('\n');
	var hasIF = function(line) {
		return line.search(/\?\?/);
	};

	// pGraph = 'JSON of graph metadata'
	pGraph = {
		nodes: [{
			label: "START",
			shape: "ellipse"
		}],
		edges: []
	};

	// populate the nodes
	for (var i = 0, n = pCode.length; i<n; i++) {
		var element = pCode[i];
		isIF = hasIF(element) != -1 ? true : false;
		// set node
		pGraph.nodes.push({
			label: element.trim(),
			shape: isIF ? "diamond" : "rect"
		});

		// set edge
		pGraph.edges.push([i, i+1]);
	}

	// set END node
	pGraph.nodes.push({label:"END",shape:"ellipse"});
	pGraph.edges.push([pCode.length, pCode.length+1]);

	return pGraph;
}

function drawChart(pGraph) {
	var g = new dagre.graphlib.Graph();
	g.setGraph({});
	g.setDefaultEdgeLabel(function() { return {}; });

	pGraph.nodes.forEach(function(element, index){
		var stringEms = parseInt(getComputedStyle(document.body).fontSize, 10);
		var stringWidth = element.label.length * stringEms - 20;
		g.setNode(index.toString(), {
			label: element.label,
			width: stringWidth,
			height: stringEms,
			shape: element.shape
		})
	});

	pGraph.edges.forEach(function(element, index){
		g.setEdge(element[0].toString(), element[1].toString());
	});

	dagre.layout(g);
	var svg = d3.select("#flowchart-display"),
	inner = svg.select("g");

	var render = new dagreD3.render();
	render(inner, g);
}

main()
