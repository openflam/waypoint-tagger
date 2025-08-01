function addWaypoint() {
  var waypointEntity = document.createElement("a-entity");
  waypointEntity.setAttribute("class", "waypoint");
  waypointEntity.setAttribute("way_point", "");
  waypointEntity.setAttribute("gltf-model", "#waypoint_model");
  waypointEntity.object3D.position.set(0, 0.6, 0);

  const ascene = document.querySelector("a-scene");
  ascene!.appendChild(waypointEntity);

  // @ts-ignore
  AFRAME.INSPECTOR.selectEntity(waypointEntity);
}

export { addWaypoint };
