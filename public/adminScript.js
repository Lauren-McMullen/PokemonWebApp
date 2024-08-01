// Get the name of all tables in database and use to populate dropdown
async function fetchTableNames() {
    const response = await fetch('/table-names', {
        method: 'GET',
    });

    const responseData = await response.json();
    const tableNames = responseData.data;

    if (tableNames.length === 0) {
        alert("No tables found in database");
    }

    const select = document.getElementById("relation-search");
    for(index in tableNames) {
        select.options[select.options.length] = new Option(tableNames[index][0], tableNames[index][0]);
    }

    fetchColumnNames(tableNames[0][0]) //populate checkboxes with first table column names
}

// Gets the column names of tableName and creates checkbox elements for each column
async function fetchColumnNames(tableName) {
    const response = await fetch(`/column-names/${tableName}`, {
        method: 'GET',
    });

    const responseData = await response.json();
    const columnNames = responseData.data;

    if (columnNames.length === 0) {
        alert("No columns found for selected table");
    }

    console.log(columnNames);

    const columnNameSelection = document.getElementById('projection-search');
    columnNameSelection.innerHTML = '';

    for(index in columnNames) {
        const checkboxElement = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "columnCheckbox"
        checkbox.id = columnNames[index][0];
        checkbox.checked = true;
        checkboxElement.appendChild(checkbox);
        checkboxElement.appendChild(document.createTextNode(columnNames[index][0]));
    
        columnNameSelection.appendChild(checkboxElement);
    }
}

// Returns array with names of all selected column checkboxes
function getSelectedColumns() {
    const checked = document.querySelectorAll('[name=columnCheckbox]:checked');
    let columns = [];
    for (let i = 0; i < checked.length; i++) {
        columns.push(checked[i].id);
    }
    return columns;
}

// Gets the selected table and column from database and displays info
async function populateTable(table, columns) {
    const tableElement = document.getElementById('admin-table');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch(`/selected-columns/${table}`, {
        method: 'GET',
        headers: {
            'columns': columns
        }
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }
    
    for (i = 0; i < columns.length; i++) {
        let header = document.createElement("th");
        header.innerText = columns[i]
        tableBody.appendChild(header);
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


window.onload = function() {
    if (!(sessionStorage.getItem("user") === 'admin')) {
        window.location.href = 'index.html'
    }
    fetchTableNames();
    const dropdown = document.getElementById('relation-search');
    dropdown.addEventListener('change', ()=> {
        fetchColumnNames(dropdown.value);
    })
    document.getElementById('submit-button').addEventListener('click', () => {
        populateTable(dropdown.value, getSelectedColumns());
    })
};