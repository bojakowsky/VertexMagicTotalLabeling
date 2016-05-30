# VertexMagicTotalLabeling

It's an vertex magic total labeling problem solver with VMTL logic written in prolog.
The GUI is node.js, javascript, cythoscape.js, html and css, bootstrap and some batch commands.
Only for windows, working on Google Chrome and IE.

###Before running
To run it, download SWI-Prolog and Node.js.
In nodeServer.js file you have to specify your own swipl prolog path. 

###First run
After installing node.js from command line run:
`node nodeServer.js`

Go to the configured site e.g.:
`http://localhost:8000/Index.html`

###Fast tutorial:
* To draw a node - right click.
* To connect nodes - click on the one node, and then on the second.
* Center -centers the view of the draw.
* Clear all - clearing the draw.
* Solve VMTL - starts VMTL problem solving, sends data to prolog with use of node.js, in bottom of the site process panel is located. As result will be ready graph will cover with values. Simple graphs have small solving time, harder graphs can take hours or days...
* \_Node\_ - here currently selected node is hold.
* Remove - removes the selected node.
* Unselect - unselects selected node.

###Graph is not vertex magic total
![alt tag](https://github.com/bojakowsky/VertexMagicTotalLabeling/blob/master/images/NotVMTL.png)

###Graph is VMTL, took couple of minutes to solve
![alt tag](https://github.com/bojakowsky/VertexMagicTotalLabeling/blob/master/images/Solved.png)

###Don't worry, it's working. Any changes are logged on node.js, so in case of doubts look at console logs.
![alt tag](https://github.com/bojakowsky/VertexMagicTotalLabeling/blob/master/images/Solving.png)

###Update
* Added possibility to view all results - finding all results takes more time.
* Seperated nodeServer.js into nodeServer_clean.js and nodeServer_logger.js - when finding all results logging every action in the console is really time consuming.
* Seperated vmtl into VMTLall and VMTLsingle - one handles printing all results, the other not.

### View all results
![alt tag](https://github.com/bojakowsky/VertexMagicTotalLabeling/blob/master/images/SolvedAll.png)
### View first result
![alt tag](https://github.com/bojakowsky/VertexMagicTotalLabeling/blob/master/images/SolvedSingle.png)
