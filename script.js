document.addEventListener('DOMContentLoaded', function () {
  fetchDataFromGoogleSheet();
});

function fetchDataFromGoogleSheet() {
  const sheetId = '';
  const apiKey = '';
  const sheetName = 'Data';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => displayData(data.values))
    .catch(error => console.error('Error fetching data:', error));
}

function displayData(data) {
  const table = document.getElementById('dataTable');

  data.forEach(function (row) {
    const newRow = table.insertRow(table.rows.length);

    row.forEach(function (cell, colIndex) {
      const newCell = newRow.insertCell();

      if (colIndex < 2) {
        // Display the first two columns as-is
        newCell.innerHTML = `<div>${cell}</div>`;
      } else {
        // Split the cell value based on newline characters
        const cellParts = cell.split('\n');

        // Display the first part in a dropdown
        const dropdown = document.createElement('select');
        const options = ['API', 'Portal', 'Salesforce'];

        options.forEach(function (option) {
          const optionElem = document.createElement('option');
          optionElem.value = option;
          optionElem.text = option;
          dropdown.add(optionElem);
        });

        // Set the selected value based on the cell data
        const selectedValue = cellParts[0].trim();
        dropdown.value = selectedValue;

        // Add event listener to apply styles on change
        dropdown.addEventListener('change', function () {
          applyStyles(dropdown);
        });

        // Append the dropdown to the cell and apply init style
        newCell.appendChild(dropdown);
        applyStyles(dropdown);

        // Display the second part in a div
        const div = document.createElement('div');
        div.textContent = cellParts[1] || ''; // Leave it empty if there is no second part
        newCell.appendChild(div);
      }
    });
  });
}

function applyStyles(select) {
  const selectedValue = select.value.toLowerCase();
  select.closest('td').className = selectedValue;
}

function handleHover(event, isMouseOver) {
  const hoverElement = event.target;

  // Function to find the closest TD element
  function findClosestTD(element) {
    if (!element) return null;
    return element.tagName === 'TD' ? element : findClosestTD(element.parentElement);
  }

  const closestTD = findClosestTD(hoverElement);

  if (closestTD) {
    const columnIndex = closestTD.cellIndex;

    if (columnIndex === 0 || columnIndex === 1) {
      const row = closestTD.closest('tr');
      if (row) {
        const tdElements = Array.from(row.querySelectorAll('td'));
        tdElements.forEach((td) => td.classList.toggle('hover', isMouseOver));
      }
    } else {
      const textContent = closestTD.textContent.trim();
      const tdElements = Array.from(document.querySelectorAll('td')).filter(
        (td) => td.textContent.trim() === textContent
      );
      tdElements.forEach((td) => td.classList.toggle('hover', isMouseOver));
    }
  }
}

document.addEventListener('mouseover', (event) => handleHover(event, true));
document.addEventListener('mouseout', (event) => handleHover(event, false));

// Function to show the popup
function showPopup(rowData) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);

  // Create popup
  const popup = document.createElement('div');
  popup.classList.add('popup');

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', () => {
    // Remove both overlay and popup when close button is clicked
    document.body.removeChild(overlay);
    document.body.removeChild(popup);
  });

  // Create list for steps
  const stepsList = document.createElement('ul');
  rowData.forEach((step) => {
    const stepItem = document.createElement('li');
    stepItem.textContent = step;
    stepsList.appendChild(stepItem);
  });

  // Append elements to popup
  popup.appendChild(stepsList);
  popup.appendChild(closeButton);

  // Append popup to the body
  document.body.appendChild(popup);
}

// Usage example
document.addEventListener('click', function (event) {
  const clickedCell = event.target.closest('td');

  // Check if the clicked element is in the first or second column
  if (clickedCell.cellIndex <= 1) {
    // Get the row data
    const rowData = Array.from(clickedCell.parentNode.cells).map(cell => cell.querySelector('div').textContent);
    // Show the popup with the row data
    showPopup(rowData);
  }
});
