import { addWaypoint } from "./button-handlers/addWaypoint";
import { downloadWaypoints } from "./button-handlers/downloadWaypoints";
import { loadGLBFromFile } from "./button-handlers/loadGLB";
import { loadWaypointsFromFile } from "./button-handlers/loadWaypoints";
import { waitForElement } from "./utils";

function initializeAframeInspector() {
    window.addEventListener("load", () => {
        const ascene = document.querySelector("a-scene");
        if (!ascene) {
            console.error("A-Frame scene not found.");
            return;
        }
        ascene.addEventListener("loaded", () => {
            if (!ascene) {
                console.error("A-Frame scene not found.");
                return;
            }
            ascene.components.inspector.openInspector(true);
        });
    });
}

function attachButtonListeners() {
    waitForElement("#add-map-mesh").then(inputElement => {
        inputElement!.addEventListener("change", loadGLBFromFile);
    });

    waitForElement("#load-waypoints-input").then(inputElement => {
        inputElement!.addEventListener("change", loadWaypointsFromFile);
    });

    waitForElement(".add-waypoint").then(buttonElement => {
        buttonElement!.addEventListener("click", addWaypoint);
    });

    waitForElement(".download-waypoints").then(buttonElement => {
        buttonElement!.addEventListener("click", downloadWaypoints);
    });
}

function initialize() {
    initializeAframeInspector();
    attachButtonListeners();
}

export { initialize };
