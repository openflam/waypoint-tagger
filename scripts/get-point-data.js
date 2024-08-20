AFRAME.registerComponent('get-point-data', {
    schema: {

    },
    init: function () {
        var sceneEl = document.querySelector('a-scene');
        var elements = sceneEl.querySelectorAll('a-entity');
        let list = [];
        for (const e of elements) {
            let c = e.components;
            if ('way_point' in c) {
                let id = c.way_point.attrValue.id;
                let position = e.object3D.position;
                list.push({ "id": id, "x": position.x, "y": position.y, "z": position.z });
            }
        }

        const csvRows = [];
        const headers = Object.keys(list[0]);
        csvRows.push(headers.join(','));

        // Loop to get value of each objects key
        for (const row of list) {
            const values = headers.map(header => {
                const val = row[header]
                return `"${val}"`;
            });

            // To add, separator between each value
            csvRows.push(values.join(','));
        }

        /* To add new line for each objects values
           and this return statement array csvRows
           to this function.*/
        const csvData = csvRows.join('\n');
        let csvFile;
        let downloadLink;

        // CSV file
        csvFile = new Blob([csvData], { type: "text/csv" });

        // Download link
        downloadLink = document.createElement("a");

        // File name
        downloadLink.download = 'way_point_data';

        // Create a link to the file
        downloadLink.href = window.URL.createObjectURL(csvFile);

        // Hide link
        downloadLink.style.display = "none";

        // Add the link to the DOM
        document.body.appendChild(downloadLink);

        // Click the link
        downloadLink.click();
    },
    update: function (oldData) {

    },
    remove: function () {

    }
})