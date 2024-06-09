AFRAME.registerComponent('way_point', {
    schema: {
        ID: { type: 'string' },
        description: { type: 'string' },
        neighbors: { type: 'string' },
    },

    init: function () {
        this.neighborLines = [];
    },

    update: function (oldData) {
        var data = this.data;
        var el = this.el;

        // If `oldData` is empty, then this means we're in the initialization process.
        // No need to update.
        if (Object.keys(oldData).length === 0) { return; }

        // Update the ID
        if (data.ID !== oldData.ID) {
            el.setAttribute("id", data.ID);

            // Update the neighbor list of the neighbors
            if (data.neighbors !== "") {
                var neighbors_array = data.neighbors.split(",");
                for (neighbor of neighbors_array) {
                    // Update the neighbor's neighbor list
                    var neighborEntity = el.sceneEl.querySelector("#" + neighbor);
                    var neighborComponent = neighborEntity.components.way_point;

                    // Remove the this item from the neighbor list
                    var neighborNeighbors = neighborComponent.data.neighbors.split(",");
                    neighborNeighbors = neighborNeighbors.filter(
                        (id) => (id != oldData.ID)
                    );
                    // Update the neighbor's neighbor list
                    neighborNeighbors.push(data.ID);
                    neighborComponent.data.neighbors = neighborNeighbors.join(",");
                }
            }
        }

        // Update neighbors
        if (data.neighbors !== oldData.neighbors) {
            var neighbors = data.neighbors.split(",");
            for (neighbor of neighbors) {
                // Update the neighbor's neighbor list
                try {
                    var neighborEntity = el.sceneEl.querySelector("#" + neighbor);
                    var neighborComponent = neighborEntity.components.way_point;
                }
                catch (error) {
                    // Inspector calls the setAttribute for every character entered. 
                    // The catch block is used to prevent the error message of non-existing element
                    // from being displayed.
                    continue;
                }

                var neighborNeighbors = neighborComponent.data.neighbors.split(",");
                // If the neighbor is not in the neighbor list, add it
                if (neighborNeighbors.length === 1 && neighborNeighbors[0] === "") {
                    neighborComponent.data.neighbors = data.ID;
                }
                else if (!neighborNeighbors.includes(data.ID)) {
                    neighborNeighbors.push(data.ID);
                    neighborComponent.data.neighbors = neighborNeighbors.join(",");
                }

                // Add a line between this waypoint and the neighbor
                this.addLineToNeighbor(neighbor);
            }
        }
    },

    addLineToNeighbor: function (neighborId) {
        var thisId = this.el.getAttribute("id");

        // Assign start and end as alphabetically smaller and larger
        startId = thisId < neighborId ? thisId : neighborId;
        endId = thisId < neighborId ? neighborId : thisId;

        // Check if the line already exists
        lineId = startId + "-" + endId;
        if (this.el.sceneEl.querySelector("#" + lineId)) {
            return;
        }

        var line = document.createElement("a-entity");
        line.setAttribute("id", lineId);
        line.setAttribute("data-aframe-inspector", "");
        line.setAttribute("waypoint_connection", {
            startEntity: "#" + startId,
            endEntity: "#" + endId,
        });
        this.el.sceneEl.appendChild(line);

        this.neighborLines.push(line);
    }
});
