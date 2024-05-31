function loadMapFromFile(fileSelectEvent) {
    const reader = new FileReader();
    
    reader.addEventListener("load", function(event) {
        mapContent = event.target.result;
        addMapToScene(mapContent);
    });
    
    reader.readAsArrayBuffer(fileSelectEvent.target.files[0]);
}

function addMapToScene(mapContent) {
    pcdLoader = new PCDLoader();
    points = pcdLoader.parse(mapContent, "map.url");
    points.material.size = 0.1;
    // points.material.color.set(0x00ff00);

    const ascene = document.querySelector("a-scene");
    const mapEntity = document.createElement("a-entity");
    mapEntity.setObject3D('mesh', points);
    ascene.appendChild(mapEntity);
}

window.onload = function(){
    ascene.addEventListener('loaded', function () {
        ascene.components.inspector.openInspector(true);
    });
}