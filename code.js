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

function removeNode()
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
    var asserts = "";
    
    for (var i = 0 ; i < cy.edges().length; i++){
        asserts += 'echo \'edge(' + cy.edges()[i].source().id() + ', ' + cy.edges()[i].target().id() + ', ' + cy.edges()[i].id() + ')\'. \n';
    }
    
    var vertices = "echo '[";
    for (var i = 0 ; i < cy.nodes().length; i++){
        vertices += cy.nodes()[i].id() + ', ';
    }
    vertices = vertices.substr(0,vertices.length-2) +"]'";
    
    return asserts + vertices;
}

function solve(){
    data = getEdgesAndNodesAsFacts();
    path = document.getElementById("swiplPath").value;
    if (path){
        
        var textToWrite = '"' + path + '\\swipl.exe" -f \"vmtl.pl\" < \"vmtl.pl\" > result.txt  2> error.txt" \n (' + data + ')> text.txt'; // without parameters
        //var textToWrite = '"' + path + '" -f \"vmtl.pl\" -- b < \"vmtl.pl\" > result.txt  2> error.txt"'; // with parameter
        var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
        var fileNameToSaveAs = "vmtl.bat";

        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Hidden Link";
        window.URL = window.URL || window.webkitURL;
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }
    else $('#errorModal').modal('show');
}

function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}

$(function(){ // on dom ready
    
    
    function createNode(){
        cy.add({
                group: "nodes", data: { id: getCurrentLetter() }, 
                renderedPosition: { x: window.event.pageX, y: window.event.pageY } 
        });
    }

    function connectTwoNodes(){
        var letter =  getCurrentLetter();
         cy.add({
            group: "edges", data: { id: letter, weight: letter, source: selectedNodeIds[0], target: selectedNodeIds[1] } 
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
            'content': 'data(id)'
          })
        .selector('edge')
          .css({
            'line-color': '#F2B1BA',
            'target-arrow-color': '#F2B1BA',
            'width': 2,
            'target-arrow-shape': 'circle',
            'opacity': 0.8,
            'content': 'data(weight)'
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


  