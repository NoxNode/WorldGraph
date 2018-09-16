var graphDiv;
var nodes = [];
var nodeWidth = 6;
var nodeHeight = 10;
var selectedNode = null;

// TODO: make the width scale based on the name
// TODO: change nodeWidth and nodeHeight based on dimensions of the window

// TODO: place nodes in a circle that scale down the farther out you go
	// make the render function scale every node in relation to the selected one
		// store a level number on each node
		// make the html_elem of the node scale based on this level number
// TODO: if you click enter on a node, it makes a pop-up appear
	// in which you can edit the name and description of the node

// TODO: render connections
	// render the line using svg see https://stackoverflow.com/questions/19382872/how-to-connect-html-divs-with-lines
	// render the text somehow
// TODO: somehow be able to edit connection names
// TODO: maybe have options for grouping nodes by connection name

function addNode() {
	// prompt user for info on new node
	var promptFields;
	if(selectedNode != null)
		promptFields = prompt("Enter as follows... Name:ConnectionToCurrentNode").split(":");
	else
		promptFields = prompt("Enter the name of the root node").split(":");
	var name = promptFields[0];
	var connection = promptFields[1];
	// create new node
	var newNode = {
		name: name,
		x: 0, y: 0,
		forwardConnections: [],
		backwardConnections: [],
		html_elem: document.createElement("div")
	};
	// add new node to list of nodes
	nodes.push(newNode);

	if(selectedNode != null) {
		// link up new node
		selectedNode.forwardConnections.push({connection: connection, node: newNode});
		newNode.backwardConnections.push({connection: connection, node: selectedNode});
		
		// place new node
		newNode.y = selectedNode.y + nodeHeight * 1.5;
		for(var i = 0; i < selectedNode.forwardConnections.length; i++) {
			var node = selectedNode.forwardConnections[i].node;
			var center = i - (selectedNode.forwardConnections.length - 1) / 2;
			node.x = selectedNode.x + center * nodeWidth * 1.5;
		}
	}

	// add visually
	newNode.html_elem.className = "item";
	newNode.html_elem.style.width = nodeWidth + "%";
	newNode.html_elem.style.height = nodeHeight + "%";
	updateName(newNode);
	graphDiv.appendChild(newNode.html_elem);

	// selectNew(newNode);
	selectNode(newNode);
}

function updateName(node) {
	node.html_elem.innerHTML = "<div class='itemText'>" + node.name + "</div>";
}

function selectNode(node) {
	if(selectedNode != null) {
		selectedNode.html_elem.className = "item";
	}
	selectedNode = node;
	selectedNode.html_elem.className = "item selected";
	render();
}

function editSelected() {
	if(selectedNode == null) return;
	selectedNode.name = prompt("Enter the new name of the selected node");
	updateName(selectedNode);
}

////////////////////////////// Hovering //////////////////////////////
var hoveredNode = null;
var hoveringUp = false;
var hoverIndex = 0;
function hoverUp() {
	if(selectedNode == null || selectedNode.backwardConnections.length == 0) return;
	if(hoveredNode != null) {
		hoveredNode.html_elem.className = "item";
	}
	hoverIndex = 0;
	hoveredNode = selectedNode.backwardConnections[hoverIndex].node;
	hoveredNode.html_elem.className = "item hovered";
	hoveringUp = true;
}

function hoverDown() {
	if(selectedNode == null || selectedNode.forwardConnections.length == 0) return;
	if(hoveredNode != null) {
		hoveredNode.html_elem.className = "item";
	}
	hoverIndex = 0;
	hoveredNode = selectedNode.forwardConnections[hoverIndex].node;
	hoveredNode.html_elem.className = "item hovered";
	hoveringUp = false;
}

function hoverLeft() {
	if(selectedNode == null) return;
	if(hoveringUp && selectedNode.backwardConnections.length == 0) return;
	if(!hoveringUp && selectedNode.forwardConnections.length == 0) return;
	if(hoveredNode != null) {
		hoveredNode.html_elem.className = "item";
	}
	if(hoveringUp && hoverIndex > 0) {
		hoverIndex--;
		hoveredNode = selectedNode.backwardConnections[hoverIndex].node;
	}
	if(!hoveringUp && hoverIndex > 0) {
		hoverIndex--;
		hoveredNode = selectedNode.forwardConnections[hoverIndex].node;
	}
	hoveredNode.html_elem.className = "item hovered";
}

function hoverRight() {
	if(selectedNode == null) return;
	if(hoveringUp && selectedNode.backwardConnections.length == 0) return;
	if(!hoveringUp && selectedNode.forwardConnections.length == 0) return;
	if(hoveredNode != null) {
		hoveredNode.html_elem.className = "item";
	}
	if(hoveringUp && hoverIndex < selectedNode.backwardConnections.length - 1) {
		hoverIndex++;
		hoveredNode = selectedNode.backwardConnections[hoverIndex].node;
	}
	if(!hoveringUp && hoverIndex < selectedNode.forwardConnections.length - 1) {
		hoverIndex++;
		hoveredNode = selectedNode.forwardConnections[hoverIndex].node;
	}
	hoveredNode.html_elem.className = "item hovered";
}

function selectHovered() {
	if(hoveredNode == null) return;
	selectNode(hoveredNode);
	hoveredNode = null;
}
////////////////////////////// Hovering //////////////////////////////

// var selectionHistory = [];
// var selectionHistoryIndex = -1;
// function selectPrevious() {
// 	if(selectionHistoryIndex <= 0) return;
// 	selectionHistoryIndex--;
// 	selectNode(selectionHistory[selectionHistoryIndex]);
// 	render();
// }

// function selectNext() {
// 	if(selectionHistoryIndex >= selectionHistory.length - 1) return;
// 	selectionHistoryIndex++;
// 	selectNode(selectionHistory[selectionHistoryIndex]);
// 	render();
// }

// function selectNew(newNode) {
// 	// select the newly added node
// 	if(selectedNode != null) {
// 		// if we're on a previous selection, remove the future history
// 		if(selectionHistoryIndex < selectionHistory.length - 1) {
// 			var numToRight = selectionHistory.length - 1 - selectionHistoryIndex;
// 			selectionHistory.splice(selectionHistoryIndex + 1, numToRight);
// 		}
// 	}
// 	// do the actual selection
// 	selectNode(newNode);
// 	// add the current selection to history
// 	selectionHistoryIndex++;
// 	selectionHistory.push(selectedNode);
// }

function render() {
	if(selectedNode == null) {
		console.log("no no");
		return;
	}
	var camera = {x: selectedNode.x, y: selectedNode.y};
	
	for(var i = 0; i < nodes.length; i++) {
		var curNode = nodes[i];
		curNode.html_elem.style.left = (curNode.x - camera.x + 50 - nodeWidth / 2) + "%";
		curNode.html_elem.style.top = (curNode.y - camera.y + 50 - nodeHeight / 2) + "%";
	}
}

var shiftDown = false;
function keyDownListener(ev) {
	console.log(ev.keyCode);
	if(ev.keyCode == 16) shiftDown = true; // shift
	if(ev.keyCode == 187 && shiftDown) addNode(); // +
	if(ev.keyCode == 38) hoverUp(); // up
	if(ev.keyCode == 37) hoverLeft(); // left
	if(ev.keyCode == 40) hoverDown(); // down
	if(ev.keyCode == 39) hoverRight(); // right
	if(ev.keyCode == 32) selectHovered(); // spacebar
	if(ev.keyCode == 13) editSelected(); // enter
}

function keyUpListener(ev) {
	if(ev.keyCode == 16) shiftDown = false;
}

function main() {
	graphDiv = document.getElementById("graph");
	document.addEventListener("keydown", keyDownListener, false);
	document.addEventListener("keyup", keyUpListener, false);
}
