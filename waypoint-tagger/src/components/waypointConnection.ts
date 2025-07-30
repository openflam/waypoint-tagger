import type { LineBasicMaterial } from "three";
import type { BufferGeometry } from "three";
import type { Line } from "three";

AFRAME.registerComponent("waypoint_connection", {
    schema: {
        startEntity: { type: "selector" },
        endEntity: { type: "selector" },
        color: { type: "color", default: "white" },
        opacity: { type: "number", default: 1 },
        linewidth: { type: "number", default: 5 }, // This doesn't seem to work
    },

    material: null as LineBasicMaterial | null,
    geometry: null as BufferGeometry | null,
    line: null as Line | null,

    init: function () {
        var data = this.data;
        var geometry;
        var material;
        material = this.material = new AFRAME.THREE.LineBasicMaterial({
            color: data.color,
            opacity: data.opacity,
            transparent: data.opacity < 1,
            visible: true,
            linewidth: data.linewidth,
        });
        geometry = this.geometry = new AFRAME.THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new AFRAME.THREE.BufferAttribute(new Float32Array(2 * 3), 3)
        );
        var positionArray = geometry.attributes.position.array;
        positionArray[0] = data.startEntity.object3D.position.x;
        positionArray[1] = data.startEntity.object3D.position.y;
        positionArray[2] = data.startEntity.object3D.position.z;
        positionArray[3] = data.endEntity.object3D.position.x;
        positionArray[4] = data.endEntity.object3D.position.y;
        positionArray[5] = data.endEntity.object3D.position.z;

        this.line = new AFRAME.THREE.Line(geometry, material);

        const lineId =
            data.startEntity.getAttribute("id") +
            "-" +
            data.endEntity.getAttribute("id");
        this.el.setObject3D(lineId, this.line);
    },

    tick: function (_time, _timeDelta) {
        var data = this.data;
        var positionArray = this.geometry!.attributes.position.array;
        positionArray[0] = data.startEntity.object3D.position.x;
        positionArray[1] = data.startEntity.object3D.position.y;
        positionArray[2] = data.startEntity.object3D.position.z;
        positionArray[3] = data.endEntity.object3D.position.x;
        positionArray[4] = data.endEntity.object3D.position.y;
        positionArray[5] = data.endEntity.object3D.position.z;
        this.geometry!.attributes.position.needsUpdate = true;
    },
});
