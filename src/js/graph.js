var tItemName = document.getElementById("tItemName");
var selectedItemDiv = document.getElementById("selectedItemDiv");
var relatedItemsDiv = document.getElementById("relatedItemsDiv");
var tRelatedItemName = document.getElementById("tRelatedItemName");
var tRelationType = document.getElementById("tRelationType");
var recentItemsDiv = document.getElementById("recentItemsDiv");
var tGraphName = document.getElementById("tGraphName");
var queryStatusDiv = document.getElementById("queryStatusDiv");

// TODO: binary searching for items
// TODO: replace recently added items with all items
// TODO: editting graphs
// TODO: relation and item greps
// TODO: handle errors
// TODO: better grapix

//Item Class
function Item () {
	this.name = "";
	this.relatedItems = [];
	this.relationTypes = [];
}

var items = [];
var selectedItem = null;

function addItemDiv(value, parentDiv) {
	var newItemDiv = document.createElement("div");
	newItemDiv.innerHTML = value;
	newItemDiv.setAttribute("class", "itemClass");
	newItemDiv.setAttribute("onmouseover", "itemMouseOver(this)");
	newItemDiv.setAttribute("onmouseout", "itemMouseOut(this)");
	newItemDiv.setAttribute("onclick", "selectItem(this)");
	parentDiv.appendChild(newItemDiv);
}

function bAddItem() {
	var newItem = new Item();
	newItem.name = tItemName.value;
	items.push(newItem);
	addItemDiv(tItemName.value, recentItemsDiv);
	tItemName.value = "";
}

// TODO: change this function to add a div for each relationType
function bAddRelatedItem() {
	if(selectedItem != null) {
		var success = false;
		for(i = 0; i < items.length; i++) {
			if(items[i].name === tRelatedItemName.value) {
				selectedItem.relatedItems.push(items[i]);
				selectedItem.relationTypes.push(tRelationType.value);
				addItemDiv(tRelatedItemName.value + ": " + tRelationType.value, relatedItemsDiv);
				success = true;
			}
		}
		if(!success) {
				alert("Error: No item with the specified name exists (Parent)");
		}
	}
	else {
		alert("Error: Parent name textbox is empty");
	}
	tRelatedItemName.value = "";
	tRelationType.value = "";
}

function itemMouseOver(element) {
	element.style.backgroundColor='rgb(127, 127, 255)';
	element.style.cursor='pointer';
	element.style.cursor='hand';
}

function itemMouseOut(element) {
	element.style.backgroundColor='rgb(255, 127, 127)';
}

// TODO: change this function to add a div for each relationType
function selectItem(element) {
	for(i = 0; i < items.length; i++) {
		var nameWithoutRelationType = element.innerHTML.split(":")[0];
		if(nameWithoutRelationType == items[i].name) {
			selectedItem = items[i];
			selectedItemDiv.innerHTML = "Selected item: " + selectedItem.name;

			//update related items
			relatedItemsDiv.innerHTML = "";
			for(j = 0; j < selectedItem.relatedItems.length; j++) {
				addItemDiv(selectedItem.relatedItems[j].name + ": " + selectedItem.relationTypes[j], relatedItemsDiv);
			}
		}
	}
}

// TODO: optimize this function
// TODO: store edges somehow
function getGraphContents() {
	var contents = "";
	if(items.length > 0) {
		contents = items[0].name;
		for(i = 1; i < items.length; i++) {
			contents += ", " + items[i].name;
		}
		return contents;
	}
	return "Empty";
}

// TODO: optimize this function
function setGraphContents(contents) {
	alert(contents);
}

function bSave() {
	$.ajax({
		url: "save.php?graphname=" + tGraphName.value + "&graphcontents=" + getGraphContents(),
		type: "GET",
		error: function(xhr, status) {
			queryStatusDiv.innerHTML = "Save failed.";
		},
		success: function (data) {
			queryStatusDiv.innerHTML = "Save status: " + data;
		}
	});
	queryStatusDiv.innerHTML = "Save request sent.";
	tGraphName.value = "";
}

function bLoad() {
	$.ajax({
		url: "load.php?graphname=" + tGraphName.value,
		type: 'GET',
		error: function(xhr, status) {
			queryStatusDiv.innerHTML = "Load failed.";
		},
		success: function (data) {
			if(data == "Error") {
				queryStatusDiv.innerHTML = "Error loading.";
			}
			else {
				setGraphContents(data);
			}
		}
	});
	queryStatusDiv.innerHTML = "Load request sent.";
	tGraphName.value = "";
}

tItemName.addEventListener("keydown", function (e) {
	if(e.keyCode == 13) { //13 == ASCII for enter key
		bAddItem();
	}
}, false);
tRelatedItemName.addEventListener("keydown", function (e) {
	if(e.keyCode == 13) { //13 == ASCII for enter key
		bAddRelatedItem();
	}
}, false);
tRelationType.addEventListener("keydown", function (e) {
	if(e.keyCode == 13) { //13 == ASCII for enter key
		bAddRelatedItem();
	}
}, false);
