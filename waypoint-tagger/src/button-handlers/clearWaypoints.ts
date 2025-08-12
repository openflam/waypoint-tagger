/**
 * removes all nodes with way_point or waypoint_connection components from the
 * screen.
 *
 * we'll call this before loading a new waypoint files, so they don't overlap.
 */

const clearWaypoints = () => {
  document.querySelectorAll("a-entity[way_point]").forEach((e) => e.remove());
  document
    .querySelectorAll("a-entity[waypoint_connection]")
    .forEach((e) => e.remove());
};

export { clearWaypoints };
