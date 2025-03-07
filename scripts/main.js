window.onload = function () {
    ascene.addEventListener('loaded', function () {
        ascene.components.inspector.openInspector(true);

        waitForElm("#add-map-mesh").then((inputElement) => {
            inputElement.addEventListener("change", loadMapMeshFromFile);
        });

        waitForElm("#add-map-pcd").then((inputElement) => {
            inputElement.addEventListener("change", loadMapPCDFromFile);
        });

        waitForElm("#load-waypoints-input").then((inputElement) => {
            inputElement.addEventListener("change", loadWaypointsFromFile);
        });

        waitForElm(".add-waypoint").then((buttonElement) => {
            buttonElement.addEventListener("click", addWaypoint);
        });

        waitForElm(".download-waypoints").then((buttonElement) => {
            buttonElement.addEventListener("click", downloadWaypoints);
        });
    });
}
