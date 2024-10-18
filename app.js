/**
 * Reads a CSV file selected by the user, parses its contents, and returns a promise
 * that resolves with the parsed data or rejects with an error message.
 *
 * @returns {Promise<Array<Array<any>>>} A promise that resolves with the parsed CSV data as an array of arrays,
 *                                       or rejects with an error message if there is an issue with reading the file.
 */
function runCalculation() {
    return new Promise((resolve, reject) => {
        const fileInput = document.getElementById("csvData");
        const file = fileInput?.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                try {
                    const results = parseCSV(e.target.result);
                    resolve(results);
                } catch (error) {
                    reject("Failed to parse CSV content");
                }
            };

            // Define the onerror event handler for the FileReader
            reader.onerror = function () {
                reject("Failed to read file");
            };

            // Read the file as text
            reader.readAsText(file);
        } else {
            reject("No file selected!");
        }
    });
}



/**
 * Parses a CSV formatted string and analyzes the data to find duplicate values
 * across different columns.
 *
 * @param {string} data - A CSV formatted string with rows of data.
 *
 * @returns {Array<Array<any>>} An array of results
 */
function parseCSV(data) {
    // Split data into rows, trim whitespace, and filter out empty rows
    const rows = data.split('\n').map(row => row.trim()).filter(row => row);

    // Extract headers from the first row
    const headers = rows[0].split(',');

    // Extract data from each row
    const dataPerRow = rows.slice(1).map(row => row.split(','));

    // Create arrays to hold column values
    const columns = headers.map((_, colIndex) =>
        dataPerRow.map(row => row[colIndex])
    );

    const results = [];

    const toggle = document.getElementById("toggle");

    // Compare each pair of columns to find common rows
    for (let i = 0; i < headers.length; i++) {
        for (let j = 0; j < headers.length; j++) {
            if (i !== j) {
                const common = columns[i].filter(value => {
                    return toggle.checked
                        ? !columns[j].includes(value) && value !== ''
                        : columns[j].includes(value) && value !== '';
                });

                const columnOneLength = columns[i].filter(value => value !== '').length;
                const columnTwoLength = columns[j].filter(value => value !== '').length;
                const similarityIndex = (common.length * 2) / (columnOneLength + columnTwoLength)

                if (common.length > 0) {
                    results.push([headers[i], headers[j], common.length, similarityIndex, common, i, j,]);
                }
            }
        }
    }

    return removeDuplicatePairs(results);
}


/**
 * Removes duplicate pairs from an array of pairs.
 *
 * @param {Array<Array<number>>} pairs - An array of pairs, where each pair is an array with exactly two elements.
 *
 * @returns {Array<Array<number>>} A new array containing only unique pairs, with duplicates removed.
 */
function removeDuplicatePairs(pairs) {
    const seen = new Set();
    const uniquePairs = [];

    pairs.forEach(pair => {
        const listNumbers = [pair[5], pair[6]]
        const sortedPair = listNumbers.slice().sort().join(',');

        if (!seen.has(sortedPair)) {
            seen.add(sortedPair);
            uniquePairs.push(pair);
        }
    });

    return uniquePairs;
}


/**
 * Converts a 2D array of results into a CSV file and triggers a download.
 *
 * @param {Array} results - A 2D array where each sub-array represents a row of data.
 */
const resultsToCSV = (results) => {
    const titles = ['Column 1 Title', 'Column 2 Title', 'Total', 'Similarity Index', 'Common Items'];
    const csvData = results.map(result => result.slice());

    csvData.forEach(result => {
        result.length = 5;
        result[4] = result[4].join(",");
    });

    csvData.unshift(titles);

    const csvContent = csvData.map(row =>
        row.map(field => {
            const strField = String(field);
            return strField.includes(',') ? `"${strField}"` : strField;
        }).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'data.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
