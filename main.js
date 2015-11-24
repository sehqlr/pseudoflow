var hasIF = function(line) {
	return line.search(/\s*\?\?/) != -1 ? true : false;
};

var hasELSE = function(line) {
	return line.search(/\s*->/) != -1 ? true : false;
};

var pCode = function(id) {
	return ["START"].concat(document.getElementById(id).value.split('\n'), "END");

};

function parsePseudocode(id) {

	code = pCode(id);
	// pGraph = 'JSON of graph metadata'
	pGraph = {
		nodes: [],
		edges: []
	};

	// populate the nodes
	for (var i = 0, n = code.length; i<n; i++) {
		var element = code[i].trim();
		console.log(element)

		var label = element.replace(/\?\?|->|=>|<=/, "").trim();
		var shape;

		if (hasIF(element)) {
			shape = "diamond";
		} else if (element === "START" || element === "END") {
			shape = "ellipse";
		} else {
			shape = "rect";
		}

		pGraph.nodes.push({label:label, shape:shape});

		if (hasIF(element)) {
			for (var j = i, m = n; j<m; j++) {
				console.log("isIF " + code[j]);
				console.log("i "+i+" n "+n+" j "+j+" m");
			}
		} else if (element !== "END"){
			pGraph.edges.push([i, i+1]);
		}

	}

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
		});
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

function main() {
	drawChart(parsePseudocode("pseudocode-editor"))
}

main()
