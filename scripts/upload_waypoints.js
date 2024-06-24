function loadWaypointsFromFile(fileSelectEvent) {
    const reader = new FileReader();
    
    reader.addEventListener("load", function(event) {
        csvFile = event.target.result;
        var parsedCSV = parseCSV(csvFile);
        createWaypointEntities(parsedCSV);
    });
    
    reader.readAsText(fileSelectEvent.target.files[0]);
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
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

function createWaypointEntities(data) {
    const scene = document.querySelector('a-scene');
    var nameToEntity = {};

    data.forEach(row => {
        const entity = document.createElement('a-entity');

        // Set the position from the CSV data
        entity.setAttribute('position', `${row.x} ${row.y} ${row.z}`);

        // Set the waypoint component with ID, description, and neighbors
        entity.setAttribute('way_point', {
            ID: row.id,
            description: row.description || '', // assuming description might be an empty string if not provided
        });
        entity.setAttribute('id', row.id);

        // Set the gltf-model attribute to the waypoint model
        entity.setAttribute("gltf-model", "#waypoint_model");

        // Append the entity to the scene
        scene.appendChild(entity);

        // Store the entity in a map for easy access
        nameToEntity[row.id] = entity;
    });

    // Update all neighbors once the items are added.
    // This is done to ensure that all waypoints are loaded before updating neighbors
    // to make sure that the lines are drawn correctly.
    data.forEach(row => {
        console.log(row.id);
        var entity = nameToEntity[row.id];
        var neighbors = row.neighbors.replaceAll(';', ',');
        entity.setAttribute('way_point', { neighbors: neighbors});
    });
}
