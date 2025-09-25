/**
 * exports existing waypoint data for download.
 * follows the OSM JSON file format as much as possible.
 *
 * currently, we have two types of objects:
 *  - way_point objects, and
 *  - waypoint_connections (which displays lines connecting neighboring
 *    way_point objects).
 *
 * OSM elements (nodes, ways, etc.) are 2-d and use wgs84 `lat` and `long`
 * coords. our data is 3-d and uses x, y, and z coords. we'll map:
 *
 * (1) nodes <- way_point entities, with
 *  - lat       <- x
 *  - lon       <- z
 *  - ele:local <- y (wgs84 is a "y-up" system)
 *
 * (2) ways <- from the neighbor information in the way_points.
 *
 * for more info on this file format, and for an example, see:
 * https://wiki.openstreetmap.org/wiki/OSM_JSON.
 */

import type { Entity } from "aframe";
import { ElementArraySchema } from "../schema";

/**
 * compares two entities by their "id" attribute in lexicographical order.
 *
 * @param a - The first entity to compare, must implement `getAttribute('id'): string`
 * @param b - The second entity to compare, must implement `getAttribute('id'): string`
 */
const byId = (a: Entity, b: Entity) =>
  a.getAttribute("id").localeCompare(b.getAttribute("id"));

function downloadWaypointsAsJSON() {
  // get all way_point entities, sorted by id
  const waypointEntities = Array.from(
    document.querySelectorAll("[way_point]") as NodeListOf<Entity>,
  ).sort(byId);

  // create a _sorted_ dictionary of waypoints, with 'id' as key
  const waypointEntitiesMap = new Map<
    string,
    {
      id: string;
      x: number;
      y: number;
      z: number;
      description: string;
      tags: object;
      neighbors: Array<string>; // array of ids
    }
  >();
  for (const wp of waypointEntities) {
    const id = wp.getAttribute("id"); // TODO: this should be numeric!
    const { x, y, z } = wp.object3D.position;
    const description = wp.components.way_point.data.description ?? "";
    const neighbors = wp.components.way_point.data.neighbors.split(",") ?? [];
    const tags = wp.components.way_point.data.tags ?? {};
    waypointEntitiesMap.set(id, { id, x, y, z, description, tags, neighbors });
  }

  // initialize the array of output elements
  const elements = [];

  // iterate through nodes in _increasing_ order of id
  for (const [
    _,
    { id, x, y, z, description, tags, neighbors },
  ] of waypointEntitiesMap) {
    // add way_point as 'node'
    const waypointNode = {
      type: "node",
      id,
      description,
      tags,
      lat: x,
      "ele:local": y,
      lon: z,
    };
    elements.push(waypointNode);

    // add connections as 'ways' (& do a simple check)
    for (const neighborId of neighbors) {
      const neighborNode = waypointEntitiesMap.get(neighborId);
      if (!neighborNode?.neighbors.includes(id)) {
        throw new Error(
          `bad input: node ${id} is neighbors with node ${neighborId}, but not vice versa`,
        );
      }

      // add connection as 'way' (if it's not already added)
      if (id.localeCompare(neighborId) >= 0) continue;
      const connectionWay = {
        type: "way",
        id: `${id}-${neighborId}`, // TODO: should be numeric
        nodes: [id, neighborId],
        tags: {}, // TODO: should this be e.g. door=yes?
      };
      elements.push(connectionWay);
    }
  }

  // validate entries; throws error on failure
  ElementArraySchema.parse(elements);

  // create JSON file
  const jsonData = JSON.stringify({ elements }, null, 2); // 2-space indent
  const jsonFile = new Blob([jsonData], { type: "application/json" });

  // download the JSON file
  const downloadLink = document.createElement("a");
  downloadLink.download = "waypoints_graph.json"; // default file name
  downloadLink.href = window.URL.createObjectURL(jsonFile); // create a link to the file
  downloadLink.style.display = "none"; // hide link
  document.body.appendChild(downloadLink); // add the link to the DOM
  downloadLink.click(); // click the link
}

export { downloadWaypointsAsJSON };
