function loadMapMeshFromFile(fileSelectEvent) {
    const reader = new FileReader();

    reader.addEventListener("load", function (event) {
        mapContent = event.target.result;
        addMapMeshToScene(mapContent);
    });

    reader.readAsArrayBuffer(fileSelectEvent.target.files[0]);
}

function addMapMeshToScene(mapContent) {
    let gltfLoader = new THREE.GLTFLoader();
    let mapContentBlob = new Blob([mapContent], { type: 'application/octet-stream' });
    let fileURL = URL.createObjectURL(mapContentBlob);

    gltfLoader.load(fileURL, function (gltf) {
        let model = gltf.scene;

        let ascene = document.querySelector("a-scene");
        let mapEntity = document.createElement("a-entity");
        mapEntity.setObject3D('mesh', model);

        // The raycaster used by inspector will ignore this entity
        mapEntity.setAttribute("data-aframe-inspector", "");

        ascene.appendChild(mapEntity);
    }
    );
}

function loadMapPCDFromFile(fileSelectEvent) {
    const reader = new FileReader();

    reader.addEventListener("load", function (event) {
        mapContent = event.target.result;
        addMapPCDToScene(mapContent);
    });

    reader.readAsArrayBuffer(fileSelectEvent.target.files[0]);
}

function addMapPCDToScene(mapContent) {
    pcdLoader = new PCDLoader();
    points = pcdLoader.parse(mapContent, "map.url");
    points.material.size = 0.1;
    // points.material.color.set(0x00ff00);

    const ascene = document.querySelector("a-scene");
    const mapEntity = document.createElement("a-entity");
    mapEntity.setObject3D('mesh', points);

    // The raycaster used by inspector will ignore this entity
    mapEntity.setAttribute("data-aframe-inspector", "");

    ascene.appendChild(mapEntity);
}
