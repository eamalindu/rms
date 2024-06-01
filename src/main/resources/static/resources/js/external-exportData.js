const exportToExcel = (jsonData, fileName, columns) => {
    var filteredData = jsonData.map(item => {
        var filteredItem = {};
        columns.forEach(column => {
            var fieldName = column.name;
            var nestedProperties = column.data.split('.');
            // Traverse the nested properties to get the final value
            var value = item;
            for (var i = 0; i < nestedProperties.length; i++) {
                value = value[nestedProperties[i]];
                if (value === undefined) {
                    // Handle undefined values to prevent errors
                    value = null;
                    break;
                }
            }
            filteredItem[fieldName] = value;
        });
        return filteredItem;
    });

    var ws = XLSX.utils.json_to_sheet(filteredData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
    XLSX.writeFile(wb, fileName + ".xlsx");
}

//untested
const exportToCSV = (jsonData, fileName, columns) => {
    // Convert the JSON data to CSV format
    var csvContent = "data:text/csv;charset=utf-8,";

    // Add column headers to CSV
    var header = columns.map(column => column.name).join(",");
    csvContent += header + "\n";

    // Add data rows to CSV
    jsonData.forEach(item => {
        var row = columns.map(column => {
            var nestedProperties = column.data.split('.');
            // Traverse the nested properties to get the final value
            var value = item;
            for (var i = 0; i < nestedProperties.length; i++) {
                value = value[nestedProperties[i]];
                if (value === undefined) {
                    // Handle undefined values to prevent errors
                    value = null;
                    break;
                }
            }
            return value;
        }).join(",");
        csvContent += row + "\n";
    });

    // Create a Blob and create a link to trigger the download
    var blob = new Blob([csvContent], { type: "text/csv" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Inquiries from" + fileName + ".csv";
    link.click();
};

const exportTableToExcel = (tableId, fileName) => {
    // Select the HTML table element by ID
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Table with ID '${tableId}' not found.`);
        return;
    }

    // Convert the HTML table to a worksheet
    const ws = XLSX.utils.table_to_sheet(table);

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    // Save the workbook as an XLSX file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};
