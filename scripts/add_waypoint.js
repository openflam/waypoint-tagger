function addWaypoint() {
    var waypointEntity = document.createElement("a-entity");
    waypointEntity.setAttribute("way_point", '');
    waypointEntity.setAttribute("gltf-model", "#waypoint_model");

    const ascene = document.querySelector("a-scene");
    ascene.appendChild(waypointEntity);

    AFRAME.INSPECTOR.selectEntity(waypointEntity);
}
