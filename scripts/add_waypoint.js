function addWaypoint() {
    var waypointEntity = document.createElement("a-entity");
    waypointEntity.setAttribute("way_point", '');

    const ascene = document.querySelector("a-scene");
    ascene.appendChild(waypointEntity);

    AFRAME.INSPECTOR.selectEntity(waypointEntity);
}
