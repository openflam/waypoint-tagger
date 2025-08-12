import type { Entity } from "aframe";
import { ElementArraySchema, type Element } from "../schema";

function loadWaypointsFromFile(fileSelectEvent: Event): void {
  const input = fileSelectEvent.target;
  if (
    !input ||
    !(input instanceof HTMLInputElement) ||
    input.type !== "file" ||
    input.files!.length !== 1
  )
    throw new Error("file select target is not defined");

  const file = input.files![0];
  const [extension] = file.name.split(".").slice(-1);

  switch (extension.toLowerCase()) {
    case "csv":
      loadWaypointsFromCSVFile(file);
      return;
    case "json":
      loadWaypointsFromJSONFile(file);
      return;
    default:
      throw new Error(`unsupported file extension: .${extension}`);
  }
}

function loadWaypointsFromCSVFile(file: File) {
  const reader = new FileReader();

  reader.addEventListener("load", function (event) {
    const csvFile = event.target?.result;
    if (typeof csvFile !== "string") {
      throw new Error("failed to read CSV file");
    }
    const parsedCSV = parseCSV(csvFile as string);
    createWaypointEntitiesFromCSV(parsedCSV);
  });

  reader.readAsText(file);
}

function loadWaypointsFromJSONFile(file: File): void {
  const reader = new FileReader();

  reader.addEventListener("load", (event) => {
    const jsonFile = event.target?.result;
    if (typeof jsonFile !== "string") {
      throw new Error("failed to read JSON file");
    }
    const { elements: data } = JSON.parse(jsonFile);
    const elements = ElementArraySchema.parse(data);
    createWaypointEntitiesFromJSON(elements);
  });

  reader.readAsText(file);
}

function parseCSV(csv: string): { [header: string]: string }[] {
  const lines = csv.split("\n");

  // Remove the last line if it's empty
  if (lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  const headers = lines[0].split(",");
  const data = lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj: { [header: string]: string } = {};
    headers.forEach((header, index) => {
      let value = values[index].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1); // Remove double quotes
      }
      obj[header.trim()] = value;
    });
    return obj;
  });
  return data;
}

function createWaypointEntitiesFromCSV(
  data: { [header: string]: string }[],
): void {
  const scene = document.querySelector("a-scene");
  var nameToEntity: { [rowID: string]: Entity } = {};

  data.forEach((row) => {
    const entity = document.createElement("a-entity");

    // Set the position from the CSV data
    entity.setAttribute("position", `${row.x} ${row.y} ${row.z}`);

    // Set the waypoint component with ID, description, and neighbors
    entity.setAttribute("way_point", {
      ID: row.id,
      description: row.description || "", // assuming description might be an empty string if not provided
    });
    entity.setAttribute("id", row.id);

    // Set the gltf-model attribute to the waypoint model
    entity.setAttribute("gltf-model", "#waypoint_model");

    // Append the entity to the scene
    scene!.appendChild(entity);

    // Store the entity in a map for easy access
    nameToEntity[row.id] = entity;
  });

  // Update all neighbors once the items are added.
  // This is done to ensure that all waypoints are loaded before updating neighbors
  // to make sure that the lines are drawn correctly.
  data.forEach((row) => {
    var entity = nameToEntity[row.id];
    var neighbors = row.neighbors.replaceAll(";", ",");
    entity.setAttribute("way_point", { neighbors: neighbors });
  });
}

function createWaypointEntitiesFromJSON(elements: Element[]) {
  const scene = document.querySelector("a-scene");
  const nameToEntity: { [rowID: string]: Entity } = {};

  // first loop: create entities for nodes
  for (const e of elements) {
    if (e.type !== "node") continue;
    const { lat: x, "ele:local": y, lon: z, id, description } = e;

    const entity = document.createElement("a-entity");
    entity.setAttribute("position", `${x} ${y} ${z}`);
    entity.setAttribute("id", id);
    entity.setAttribute("way_point", { ID: id, description });

    // set the gltf-model attribute to the waypoint model
    entity.setAttribute("gltf-model", "#waypoint_model");

    // append the entity to the scene
    scene!.appendChild(entity);

    // store the entity in a map for easy access
    nameToEntity[id] = entity;
  }

  // second loop: create neighbors
  for (const e of elements) {
    if (e.type !== "way") continue;
    const { nodes } = e;
    if (nodes.length !== 2)
      throw new Error("each way should connect only 2 nodes");
    const [nodeAId, nodeBId] = nodes;

    const nodeA = nameToEntity[nodeAId];
    const nodeB = nameToEntity[nodeBId];

    // add B as neighbor to A
    const { neighbors: neighborsOfA } = nodeA.getAttribute("way_point");
    nodeA.setAttribute("way_point", {
      neighbors: addNeighbor(neighborsOfA, nodeBId),
    });

    // add A as neighbor to B
    const { neighbors: neighborsOfB } = nodeB.getAttribute("way_point");
    nodeB.setAttribute("way_point", {
      neighbors: addNeighbor(neighborsOfB, nodeAId),
    });
  }
}

const addNeighbor = (neighbors: string, newNeighbor: string) => {
  return neighbors === "" ? newNeighbor : `${neighbors},${newNeighbor}`;
};

export { loadWaypointsFromFile };
