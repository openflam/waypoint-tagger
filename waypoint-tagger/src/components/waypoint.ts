import type { Entity } from "aframe";

AFRAME.registerComponent("way_point", {
  schema: {
    ID: { type: "string" },
    description: { type: "string" },
    tags: {
      default: {},
      stringify: (value: object) =>
        Object.entries(value).map(([key, value]) => `${key}=${value}`),
    },
    neighbors: { type: "string" },
  },

  neighborLines: [] as Entity[],
  textEntity: null as Entity | null,

  init: function () {
    this.neighborLines = [];
    this.textEntity = document.createElement("a-entity");
    this.textEntity.setAttribute("text", {
      width: 5,
      value: this.data.ID,
      align: "center",
    });
    this.textEntity.setAttribute("position", { x: 0, y: 1.0, z: 0 });
    this.el.appendChild(this.textEntity);
  },

  update: function (oldData) {
    var data = this.data;
    var el = this.el;

    // If `oldData` is empty, then this means we're in the initialization process.
    // So oldData is set to the default value of the schema.
    if (Object.keys(oldData).length === 0) {
      oldData = {
        ID: "init-random-id-do-not-use",
        description: "",
        neighbors: "",
      };
    }

    // Update the ID
    if (data.ID !== oldData.ID) {
      el.setAttribute("id", data.ID);
      this.textEntity!.setAttribute("text", {
        value: data.ID,
      });

      // Update the neighbor list of the neighbors
      // If this is the first time the waypoint is created, do not update the neighbors
      if (oldData.ID !== "init-random-id-do-not-use" && data.neighbors !== "") {
        var neighbors_array = data.neighbors.split(",");
        for (const neighbor of neighbors_array) {
          // Update the neighbor's neighbor list
          var neighborEntity = el.sceneEl!.querySelector(
            "#" + neighbor,
          ) as Entity;
          var neighborComponent = neighborEntity!.components.way_point;

          // Remove the this item from the neighbor list
          var neighborNeighbors = neighborComponent.data.neighbors.split(",");
          neighborNeighbors = neighborNeighbors.filter(
            (id: string) => id != oldData.ID,
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

      // Get the neighbors that are removed and added
      var removedNeighbors = oldNeighbors_list.filter(
        (id: string) => !neighbors_list.includes(id),
      );
      var addedNeighbors = neighbors_list.filter(
        (id: string) => !oldNeighbors_list.includes(id),
      );

      // Add new neighbor
      for (const neighbor of addedNeighbors) {
        // Update the neighbor's neighbor list
        var neighborEntity = el.sceneEl!.querySelector(
          "#" + neighbor,
        ) as Entity;
        var neighborComponent = neighborEntity!.components.way_point;
        var neighborNeighbors = neighborComponent.data.neighbors.split(",");
        // If the neighbor is not in the neighbor list, add it
        if (neighborNeighbors.length === 1 && neighborNeighbors[0] === "") {
          neighborComponent.data.neighbors = data.ID;
        } else if (!neighborNeighbors.includes(data.ID)) {
          neighborNeighbors.push(data.ID);
          neighborComponent.data.neighbors = neighborNeighbors.join(",");
        }

        // Add a line between this waypoint and the neighbor
        this.addLineToNeighbor(neighbor);
      }

      // Remove the removed neighbor
      for (const neighbor of removedNeighbors) {
        // Update the neighbor's neighbor list
        var neighborEntity = el.sceneEl!.querySelector(
          "#" + neighbor,
        ) as Entity;
        var neighborComponent = neighborEntity!.components.way_point;
        var neighborNeighbors = neighborComponent.data.neighbors.split(",");

        // Remove the this item from the neighbor list
        neighborNeighbors = neighborNeighbors.filter(
          (id: string) => id != data.ID,
        );

        // Update the neighbor's neighbor list
        neighborComponent.data.neighbors = neighborNeighbors.join(",");

        // Remove the line between this waypoint and the neighbor
        this.removeLineToNeighbor(neighbor);
      }
    }
  },

  getValidNeighbors: function (neighbors: string): string[] {
    const neighborsArray = neighbors.split(",");
    const valid_neighbors = neighborsArray
      .map((id) => id.trim())
      .filter(
        (id) => id !== "" && this.el.sceneEl!.querySelector("#" + id) !== null,
      );
    return valid_neighbors;
  },

  addLineToNeighbor: function (neighborId: string) {
    var thisId = this.el.getAttribute("id");

    // Assign start and end as alphabetically smaller and larger
    const startId = thisId < neighborId ? thisId : neighborId;
    const endId = thisId < neighborId ? neighborId : thisId;

    // Check if the line already exists
    const lineId = startId + "-" + endId;
    if (this.el.sceneEl!.querySelector("#" + lineId)) {
      return;
    }

    var line = document.createElement("a-entity");
    line.setAttribute("id", lineId);
    line.setAttribute("data-aframe-inspector", "");
    line.setAttribute("waypoint_connection", {
      startEntity: "#" + startId,
      endEntity: "#" + endId,
    });
    this.el.sceneEl!.appendChild(line);

    this.neighborLines.push(line);
  },

  removeLineToNeighbor: function (neighborId: string) {
    var thisId = this.el.getAttribute("id");

    // Assign start and end as alphabetically smaller and larger
    const startId = thisId < neighborId ? thisId : neighborId;
    const endId = thisId < neighborId ? neighborId : thisId;

    // Check if the line already exists
    const lineId = startId + "-" + endId;
    var line = this.el.sceneEl!.querySelector("#" + lineId);
    if (line) {
      this.el.sceneEl!.removeChild(line);
    }

    this.neighborLines = this.neighborLines.filter(
      (line) => line.getAttribute("id") != lineId,
    );
  },
});
