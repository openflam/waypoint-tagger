function downloadWaypoints() {
    // Get all waypoints information
    var waypoint_entities = document.querySelectorAll("[way_point]");

    var waypoint_info_list = [];
    for (const entity of waypoint_entities) {
        waypoint_info_list.push({
            "id": entity.getAttribute("id"),
            "x": entity.object3D.position.x,
            "y": entity.object3D.position.y,
            "z": entity.object3D.position.z,
            "neighbors": entity.components.way_point.data.neighbors
        });
    }

    // Create CSV file
    var csvRows = [];
    var headers = Object.keys(waypoint_info_list[0]);
    csvRows.push(headers.join(','));
    for (const row of waypoint_info_list) {
        var values = headers.map(header => {
            var val = row[header];
            return `"${val}"`;
        });
        csvRows.push(values.join(','));
    }
    var csvData = csvRows.join('\n');
    var csvFile = new Blob([csvData], { type: "text/csv" });

    // Download CSV
    var downloadLink = document.createElement("a");
    downloadLink.download = 'waypoints_graph.csv'; // File name
    downloadLink.href = window.URL.createObjectURL(csvFile); // Create a link to the file
    downloadLink.style.display = "none"; // Hide link
    document.body.appendChild(downloadLink); // Add the link to the DOM
    downloadLink.click(); // Click the link
}