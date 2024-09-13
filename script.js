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

                const existingObject = jsonData.find(item => item.id === "$YK_SAMPLECODE");
                if (existingObject) {
                    existingObject.animation = [{
                        "id": newId,
                        "x": xCoordinate,
                        "y": yCoordinate
                    }];
                }

                jsonData.unshift(newObject);

                document.getElementById('output').textContent = JSON.stringify(jsonData, null, 2);
            }
        }

        function copyToClipboard() {
            const outputTextArea = document.getElementById('output');
            outputTextArea.select();
            document.execCommand('copy');
            alert('Output copied to clipboard!');
        }