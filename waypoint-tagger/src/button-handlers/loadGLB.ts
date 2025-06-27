// @ts-ignore
const DRACO_LOADER = new THREE.DRACOLoader().setDecoderPath(
    'https://www.gstatic.com/draco/versioned/decoders/1.5.7/',
);

function loadGLBFromFile(fileSelectEvent: Event): void {
    const input = fileSelectEvent.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
        return;
    }
    const reader = new FileReader();

    reader.addEventListener("load", function (e: ProgressEvent<FileReader>) {
        const fileReader = e.target as FileReader;
        const mapContent = fileReader.result as ArrayBuffer;
        addGLBToScene(mapContent);
    });

    reader.readAsArrayBuffer(input.files[0]);
}

function addGLBToScene(mapContent: ArrayBuffer): void {
    // @ts-ignore
    const gltfLoader = new THREE.GLTFLoader().setDRACOLoader(DRACO_LOADER);

    const mapContentBlob = new Blob([mapContent], { type: 'application/octet-stream' });
    const fileURL = URL.createObjectURL(mapContentBlob);

    gltfLoader.load(fileURL, function (gltf: any) {
        // @ts-ignore
        window.thisGLTF = gltf; // Store the GLTF object globally for debugging

        const model = gltf.scene || gltf.scenes[0];

        const mapEntity = document.createElement("a-entity");
        mapEntity.setObject3D('mesh', model);

        // The raycaster used by inspector will ignore this entity
        mapEntity.setAttribute("data-aframe-inspector", "");

        const ascene = document.querySelector("a-scene");
        if (!ascene) {
            console.warn("<a-scene> not found in the DOM.");
            return;
        }
        ascene.appendChild(mapEntity);
    });
}

export {
    loadGLBFromFile
}