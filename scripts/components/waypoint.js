AFRAME.registerComponent('way_point', {
    schema: {
        ID: { type: 'string' },
        description: { type: 'string' },
        neighbors: { type: 'string' },
    },

    init: function () {
        this.neighborLines = [];
        this.textEntity = document.createElement("a-entity");
        this.textEntity.setAttribute("text", { 
            "width": 10, 
            "value": this.data.ID ,
            "align": "center",
        });
        this.textEntity.setAttribute("position", { x: 0, y: 1.0, z: 0 });
        this.el.appendChild(this.textEntity);
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
            this.textEntity.setAttribute("text", {
                "value" : data.ID,
            });
            
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
            var neighbors_list = this.getValidNeighbors(data.neighbors);
            var oldNeighbors_list = this.getValidNeighbors(oldData.neighbors);

            console.log("New neighbors and old neighbors:");
            console.log(neighbors_list);
            console.log(oldNeighbors_list);

            // Get the neighbors that are removed and added
            var removedNeighbors = oldNeighbors_list.filter(
                (id) => (!neighbors_list.includes(id))
            );
            var addedNeighbors = neighbors_list.filter(
                (id) => (!oldNeighbors_list.includes(id))
            );

            console.log("Removed neighbors and added neighbors:");
            console.log(removedNeighbors);
            console.log(addedNeighbors);

            // Add new neighbor
            for (neighbor of addedNeighbors) {
                // Update the neighbor's neighbor list
                var neighborEntity = el.sceneEl.querySelector("#" + neighbor);
                var neighborComponent = neighborEntity.components.way_point;
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

            // Remove the removed neighbor
            for (neighbor of removedNeighbors) {
                // Update the neighbor's neighbor list
                var neighborEntity = el.sceneEl.querySelector("#" + neighbor);
                var neighborComponent = neighborEntity.components.way_point
                var neighborNeighbors = neighborComponent.data.neighbors.split(",");

                // Remove the this item from the neighbor list
                neighborNeighbors = neighborNeighbors.filter(
                    (id) => (id != data.ID)
                );

                // Update the neighbor's neighbor list
                neighborComponent.data.neighbors = neighborNeighbors.join(",");

                // Remove the line between this waypoint and the neighbor
                this.removeLineToNeighbor(neighbor);
            }
        }
    },

    getValidNeighbors: function (neighbors) {
        neighbors = neighbors.split(",");
        neighbors = neighbors.map((id) => id.trim());
        valid_neighbors = neighbors.filter(
            (id) => ((id !== "") && (this.el.sceneEl.querySelector("#" + id) !== null))
        );
        return valid_neighbors;
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
    },

    removeLineToNeighbor: function (neighborId) {
        var thisId = this.el.getAttribute("id");

        // Assign start and end as alphabetically smaller and larger
        startId = thisId < neighborId ? thisId : neighborId;
        endId = thisId < neighborId ? neighborId : thisId;

        // Check if the line already exists
        lineId = startId + "-" + endId;
        var line = this.el.sceneEl.querySelector("#" + lineId);
        if (line) {
            this.el.sceneEl.removeChild(line);
        }

        this.neighborLines = this.neighborLines.filter(
            (line) => (line.getAttribute("id") != lineId)
        );
    }
});
