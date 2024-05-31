window.onload = function(){
    ascene.addEventListener('loaded', function () {
        ascene.components.inspector.openInspector(true);

        waitForElm("#add-map-input").then((inputElement) => {
            inputElement.addEventListener("change", loadMapFromFile);
        });
    });
}
