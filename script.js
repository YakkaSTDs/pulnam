function processForm() {
    const jsonFileInput = document.getElementById('jsonInput');
    const jsonPaste = document.getElementById('jsonPaste').value;
    const imageInput = document.getElementById('imageInput');
    const xCoordinate = parseInt(document.getElementById('xCoordinate').value, 10);
    const yCoordinate = parseInt(document.getElementById('yCoordinate').value, 10);

    let jsonData = [];
    let jsonFile = jsonFileInput.files[0];

    if (jsonFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                jsonData = JSON.parse(event.target.result);
                processJSON();
            } catch (error) {
                alert("Error parsing JSON file.");
            }
        };
        reader.readAsText(jsonFile);
    } else if (jsonPaste) {
        try {
            jsonData = JSON.parse(jsonPaste);
            processJSON();
        } catch (error) {
            alert("Error parsing JSON from paste.");
        }
    } else {
        alert("Please provide JSON data.");
    }

    function processJSON() {
        if (!imageInput.files[0]) {
            alert("Please upload a PNG image.");
            return;
        }

        const newId = `night_animation_${Date.now()}`;
        const newObject = {
            "id": newId,
            "type": "animation",
            "light": true,
            "light switching": true,
            "frames": [
                {
                    "bmp": imageInput.files[0].name
                }
            ]
        };

        // Add the new night animation object to the beginning of the JSON data
        jsonData.unshift(newObject);

        // Get the object that comes immediately after the newly inserted object
        if (jsonData.length > 1) {  // Ensure there's an object after the new one
            const nextObject = jsonData[1];  // The object right after the new animation object

            // Add the animation reference to the next object
            if (nextObject) {
                nextObject.animation = [{
                    "id": newId,  // Use the generated ID
                    "x": xCoordinate,  // Use user input for x coordinate
                    "y": yCoordinate   // Use user input for y coordinate
                }];
            }
        }

        // Display the output JSON in the textarea
        document.getElementById('output').textContent = JSON.stringify(jsonData, null, 2);
    }
}