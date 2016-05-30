letterCounter = 0; // <= 25
additionalCounter = -1;
selectedNodeIds = [];
var cy;

function getCurrentLetter(){
    var letter = "";
    if (additionalCounter >= 0) 
        letter = String.fromCharCode(97 + additionalCounter);
    letter += String.fromCharCode(97 + letterCounter);
    incrementLetterCounter();
    return letter;
}

function incrementLetterCounter()
{
    letterCounter++;
    if (letterCounter % 26 == 0){
        letterCounter = 0;
        additionalCounter++;
    }
}

function clearAll(){
    cy.load();
    letterCounter = 0;
    additionalCounter = -1;
    selectedNodeIds = [];
}

function centerGraph(){
    cy.reset();
}

function removeNodess()
{
    if (selectedNodeIds && selectedNodeIds.length > 0){
        cy.remove("#"+ selectedNodeIds[0]);
        selectedNodeIds = [];   
        $("#node").text("_Node_")
    }
}

function unselectNode(){
    w = window["selectedNodes"] = cy.$('node:selected');
    w.unselect();
    selectedNodeIds = [];  
    $("#node").text("_Node_");
}

function getEdgesAndNodesAsFacts(){
    var asserts = "echo ";
    
    for (var i = 0 ; i < cy.edges().length; i++){
        asserts += 'edge^(' + cy.edges()[i].source().id() + ', ' + cy.edges()[i].target().id() + ', ' + cy.edges()[i].id() + '^). & echo.';
    }
    
    var vertices = "[";
    for (var i = 0 ; i < cy.nodes().length; i++){
        vertices += cy.nodes()[i].id() + ', ';
    }
    vertices = vertices.substr(0,vertices.length-2) +"].";
    
    return asserts + vertices;
}
var allResults;
var resultIndex = 0;
function showNextResult(index){
	var splitData = allResults[index].split(" ").filter(function(el) {return el.length != 0});
						
	splitData[0] = splitData[0].replace("[", "");
	splitData[0] = splitData[0].replace("]", "");
	
	splitData[1] = splitData[1].replace("[", "");
	splitData[1] = splitData[1].replace("]", "");
	
	splitData[2] = splitData[2].replace("[", "");
	splitData[2] = splitData[2].replace("]", "");
	
	splitIds = splitData[0].split(",");
	splitVal = splitData[1].split(",");
	
	for (var i = 0 ; i < splitIds.length; ++i){
		cy.$("#" + splitIds[i]).attr("text", 
			splitIds[i] + " = " + splitVal[i]);
	}
	$("#resultText").text("(" + (index+1) + "/" + allResults.length + ") " + 
		"True, it's vertex-magic total graph. Sum for each vertex is: " + splitData[2]);
	if (allResults.length > 1)
		$("#showNextResult").css("visibility", "visible");
}

function nextResult(){
	resultIndex = resultIndex + 1;
	if (resultIndex == allResults.length) resultIndex = 0
	showNextResult(resultIndex);
}

function resetAndHide(){
	resultIndex = 0;
	$("#showNextResult").css("visibility", "hidden");
}

function solve(){
	resetAndHide();
	$("#resultText").text("Please wait, it can take a while... To break solving click the button again.");
	
    dataToSend = getEdgesAndNodesAsFacts();
    //path = document.getElementById("swiplPath").value;
    //if (path){
        var dataToSendAsJSON = JSON.parse('{"data": "(' + dataToSend + ') > asserts.txt" }');
        //var textToWrite = '(' + dataToSend + ')> asserts.txt \n"' + path + '\\swipl" -f \"vmtl.pl\" < \"vmtl.pl\" > result.txt  2> error.txt"'; // without parameters
        //var textToWrite = '"' + path + '" -f \"vmtl.pl\" -- b < \"vmtl.pl\" > result.txt  2> error.txt"'; // with parameter
        //var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
        //var fileNameToSaveAs = "vmtl.bat";
		var socket = io.connect('http://localhost:81'); // connec to server
	    socket.on('news', function (data) { // listen to news event raised by the server
		  console.log(dataToSendAsJSON);
		  socket.emit('execute', dataToSendAsJSON ); // raise an event on the server
	    });
		
		socket.on('reply', function(data){
			var data = data.data;
			if (data != 'False.'){
				allResults = data.split("!").filter(function(el) {return el.length != 0});
				if (allResults.length > 0)
					showNextResult(resultIndex);

				// for (var i = 0 ; i < allResults.length; i++)
				// {
					// (function(index){
					// setTimeout(function(){
						
					// }, 2000*i);
					// })(i);
				// }
			}
			else {
				$("#resultText").text("False, it's not vertex-magic total graph");
				resetAndHide();
			}

		});
        /*var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Hidden Link";
        window.URL = window.URL || window.webkitURL;
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();*/
    //}
    //else $('#errorModal').modal('show');
}

function solveSingle(){
	resetAndHide();
	$("#resultText").text("Please wait, it can take a while... To break solving click the button again.");
	
    dataToSend = getEdgesAndNodesAsFacts();
	var dataToSendAsJSON = JSON.parse('{"data": "(' + dataToSend + ') > asserts.txt" }');
	var socket = io.connect('http://localhost:81'); // connec to server
	socket.on('news', function (data) { // listen to news event raised by the server
	  console.log(dataToSendAsJSON);
	  socket.emit('executeFast', dataToSendAsJSON ); // raise an event on the server
	});
	
	socket.on('reply', function(data){
		var data = data.data;
		if (data != 'False.'){
			allResults = data.split("!").filter(function(el) {return el.length != 0});
				if (allResults.length > 0)
					showNextResult(resultIndex);
		}
		else {
			$("#resultText").text("False, it's not vertex-magic total graph");
			resetAndHide();
		}

	});
}

function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}

$(function(){ // on dom ready
    
    
    function createNode(){
		var newId =getCurrentLetter();
        cy.add({
                group: "nodes", data: { id: newId, text: newId  }, 
                renderedPosition: { x: window.event.pageX, y: window.event.pageY } 
        });
    }

    function connectTwoNodes(){
        var letter =  getCurrentLetter();
         cy.add({
            group: "edges", data: { id: letter, weight: letter, text: letter, source: selectedNodeIds[0], target: selectedNodeIds[1] } 
         });
    }
    
    cy = cytoscape({
    container: document.getElementById('cy'),
      style: cytoscape.stylesheet()
        .selector('node')
          .css({
            'background-color': '#B3767E',
            'width': 'mapData(baz, 0, 25, 25, 55)',
            'height': 'mapData(baz, 0, 25, 25, 55)',
            'content': 'data(text)'
          })
        .selector('edge')
          .css({
            'line-color': '#F2B1BA',
            'target-arrow-color': '#F2B1BA',
            'width': 2,
            'target-arrow-shape': 'circle',
            'opacity': 0.8,
            'content': 'data(text)'
          })
        .selector(':selected')
          .css({
            'background-color': 'black',
            'line-color': 'black',
            'target-arrow-color': 'black',
            'source-arrow-color': 'black',
            'opacity': 1
          })
        .selector('.faded')
          .css({
            'opacity': 0.25,
            'text-opacity': 0
          }),

      /*elements: {
        nodes: [
                { data: { id: 'a'} },
                { data: { id: 'b'} },
            ], 

        edges: [
                { data: { id: 'c', weight: 'c', source: 'a', target: 'b' } },
            ]
      },*/

      layout: {
        name: 'circle',
        padding: 5
      },

      ready: function(){
        // ready 1
      }
    });
    
    $('#cy').mousedown(function(event) {
        switch (event.which) {
        case 3:
            createNode();
            break;
        }
        

    });
    
    cy.on('select', 'node', function(event){
         w = window["selectedNodes"] = cy.$('node:selected');
         nodeId = this.data('id');
         selectedNodeIds.push(nodeId);
         $("#node").text(nodeId)
         if (selectedNodeIds.length == 2){
             connectTwoNodes();
             selectedNodeIds = [];
             w.unselect();
             $("#node").text("_Node_")
         }
    });
    
}); // on dom ready


  