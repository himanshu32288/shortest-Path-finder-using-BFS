var len = 25;
var wall = 'rgb(0, 0, 0)';
var original = 'rgb(96, 255, 234)';
var path = 'rgb(73, 83, 221)';
function setup() {
    var maze = document.getElementById('maze');
    var count = 1;

    //creating grid to represent our graph
    for (var i = 0; i < 25; i++) {
        var row = document.createElement('div');
        row.className = 'row row' + (i + 1);
        row.id = 'row' + (i + 1);
        for (var j = 0; j < 25; j++) {
            var node = document.createElement('div');
            node.className = 'node node' + ((i * 10) * (j + 1));
            node.id = 'node' + count;

            if ((count != 253 && count != 269)) {//creating wall or removing wall except start node and end node

                node.onclick = function () {
                    clicked(this.id);
                }
            }
            count++;
            row.appendChild(node);
        }
        maze.appendChild(row);
    }
}



function reset() {
    for (var i = 1; i <= 625; i++) {
        var node = document.getElementById('node' + i);
        if (i != 253 && i != 269)
            node.style.backgroundColor = original;
    }

}

function solve() {
    var graph = [];
    //Initilising graph
    for (let i = 0; i < len; i++) {
        graph[i] = new Array(len).fill(0);
    }
    var rcnt = 0;
    var ccnt = 0;
    var nodeVal = 1;
    for (var i = 1; i <= (len * len); i++) {
        if (document.getElementById('node' + i).style.backgroundColor == wall) {
            graph[rcnt][ccnt] = -1;
        } else {
            graph[rcnt][ccnt] = nodeVal;
        }
        ccnt++;
        if (ccnt == len) {
            rcnt++;
            ccnt = 0;
        }
        nodeVal++;
    }
    // console.log(graph); 
    var adj = {};
    var moves = [[-1, 0], [1, 0], [0, 1], [0, -1]];  //up down right left   
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++) {
            if (graph[i][j] == -1)
                continue;
            var currnode = graph[i][j];
            var adjacentnode = [];
            for (var count = 0; count < 4; count++) {
                var row = i + moves[count][0];
                var col = j + moves[count][1];
                if (row < len && row >= 0 && col < len && col >= 0) {
                    if (graph[row][col] != -1)
                        adjacentnode.push([row, col]);
                }
            }
            adj[currnode] = adjacentnode;
        }
    }
    var visited = [];
    var prev = new Array(len * len).fill(false);
    for (var i = 0; i < len; i++) {
        visited[i] = new Array(len).fill(false);
    }
    var queue = [];
    var flag = false;
    queue.push([10, 2]);   // BFS step i.e remove mark visited check for dest else add neighours
    while (queue.length > 0) {
        var nodecolor = queue.splice(0, 1)[0];
        var node = graph[nodecolor[0]][nodecolor[1]];
        visited[nodecolor[0]][nodecolor[1]] = true;
        if (node == 269) {
            flag = true;
            break;
        }
        var neighour = adj[node];   //neighors of removed node
        for (var i = 0; i < neighour.length; i++) {
            var n = neighour[i];
            if (!visited[n[0]][n[1]]) {   //adding to queue if not visited
                queue.push(n);
                visited[n[0]][n[1]] = true;
                prev[graph[n[0]][n[1]]] = node;

            }
        }
    }
    if (!flag) {
        alert("path not exist");
        reset();
        return "";
    }

    var endnode = 269;  //dest node
    console.log(prev);
    var previous = endnode;
    var loop = false;
    while (true) {
        var node = prev[previous];

        try {
            document.getElementById('node' + node).style.backgroundColor = path;

        } catch (err) {
            loop = true;
        }
        if (node == 253) {
            loop = true;
        } else {
            previous = node;
        }
        if (loop) {
            break;
        }
    }
    document.getElementById('node253').style.backgroundColor = 'rgb(255, 0, 0)';
    document.getElementById('node269').style.backgroundColor = 'rgb(0, 128, 0)';
}

function clicked(elementID) {
    var node = document.getElementById(elementID);
    if (node.style.backgroundColor == wall) {//if it is wall change back not wall and vice versa
        node.style.backgroundColor = original;
    } else {
        node.style.backgroundColor = wall
    }
}
