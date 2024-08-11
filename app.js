function runCalculation() {
    return new Promise((resolve, reject) => {
        const file = document.getElementById("csvData").files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const results = parseCSV(e.target.result);
                resolve(results); // Resolve the promise with the results
            };

            reader.onerror = function() {
                reject("Failed to read file");
            };

            reader.readAsText(file); // Trigger the file reading

        } else {
            reject("No file selected!");
        }
    });
}


function parseCSV(data) {
    const rows          = data.split('\n').map(row => row.trim()).filter(row => row);
    const headers       = rows[0].split(';');
    const data_per_row  = rows.map(row => row.split(';'));
    const arrays        = [];
    const results       = [];

    for (let k = 0; k < headers.length; k++) {
        arrays.push(data_per_row.map(row => row[k]));
    }

    for (let i = 0; i < headers.length; i++) {
        for (let j = 0; j < headers.length; j++) {
            arrays[i].map((row, index) => {
                if (row == arrays[j][index] && i != j) {
                    results.push([headers[i], i, headers[j], row]);
                }
            })
        }
    }

    return results;
}

// Όνομα πρώτης λίστας - Όνομα δεύτερης λίστας - Αριθμός Κοινών Στοιχείων - Κοινά στοιχεία