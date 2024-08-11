function runCalculation() {
    const file = document.getElementById("csvData").files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const csvContent = e.target.result;

            // const parsedData = parseCSV(csvContent);
            parseCSV(csvContent);

            // const outputElement = document.getElementById("output");
            // outputElement.textContent = JSON.stringify(
            //     parsedData,
            //     null,
            //     2
            // );
        };

        reader.readAsText(file);
    } else {
        alert("No file selected!");
    }
}


function parseCSV(data) {
    const rows = data.split('\n').map(row => row.trim()).filter(row => row);
    const headers = rows[0].split(',');

    // Initialize arrays for each column
    const parsedData = headers.reduce((acc, header) => {
        acc[header] = [];
        return acc;
    }, {});

    // Fill each array with data from the corresponding column
    rows.slice(1).forEach(row => {
        const values = row.split(',');
        values.forEach((value, index) => {
            parsedData[headers[index]].push(value);
        });
    });

    const array1 = [];
    const array2 = [];
    const results = [];


    parsedData['List 1;List 2'].forEach(row => {
        const ali = row.split(';')
        array1.push(ali[0])
        array2.push(ali[1])
    })

    for(let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++ ) {
            if (array1[i] == array2[j]) {
                results.push(array1[i]);
            }
        }
    }

    console.log(results)
    const outputElement = document.getElementById("output");
    outputElement.textContent = results;

    return parsedData;
}


// Όνομα πρώτης λίστας - Όνομα δεύτερης λίστας - Αριθμός Κοινών Στοιχείων - Κοινά στοιχεία