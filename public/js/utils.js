export function fetchDataFromServer() {
  fetch('/readMainTable')
    .then(response => {
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then(data => displayData(data))
    .catch(error => console.error('Error fetching data:', error));
}

function updateServerWithData(updatedData) {
  fetch('/writeMainTable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  }).then(response => {
    if (!response.ok)
      throw new Error(`HTTP error! Status: ${response.status}`);
  }).catch(error => console.error('Error updating data on the server:', error));
}

export function displayData(data) {
  const table = document.getElementById('dataTable');

  data.forEach(function (row, rowIndex) {
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
        dropdown.value = cellParts[0].trim();

        // Add event listener to save and apply styles on change
        dropdown.addEventListener('change', function () {
          // Update the data
          data[rowIndex][colIndex] = dropdown.value + '\n' + cellParts[1];
          updateServerWithData(data);
          applyStyles(dropdown);
        });

        // Append the dropdown to the cell and apply init style
        newCell.appendChild(dropdown);
        applyStyles(dropdown);

        // Display the second part in a div
        const div = document.createElement('div');
        div.textContent = cellParts[1] || ''; // Leave it empty if there is no second part
        newCell.appendChild(div);

        // Add a checkbox
        const checkboxDiv = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        newCell.appendChild(checkboxDiv);
        checkboxDiv.appendChild(checkbox);
        // Add event listener to apply styles on change
        checkbox.addEventListener('change', function () {
          if (checkbox.checked) {
            checkbox.setAttribute('checked', '');
          } else {
            checkbox.removeAttribute('checked');
          }
        });
      }
    });
    // Add a '+' cell at the end of each row, to enable adding extra steps
    const addCell = newRow.insertCell();
    addCell.className = 'add'
    addCell.innerHTML = '<div>+</div>';
  });
}

function applyStyles(select) {
  const selectedValue = select.value.toLowerCase();
  select.closest('td').className = selectedValue;
}

export function handleHover(event, isMouseOver) {
  const hoverElement = event.target;

  // Function to find the closest TD element
  function findClosestTD(element) {
    if (!element) return null;
    return element.tagName === 'TD' ? element : findClosestTD(element.parentElement);
  }

  const targetTD = findClosestTD(hoverElement);

  if (targetTD) {
    const columnIndex = targetTD.cellIndex;

    if (columnIndex === 0 || columnIndex === 1) {
      const row = targetTD.closest('tr');
      if (row) {
        const tdElements = Array.from(row.querySelectorAll('td'));
        tdElements.forEach((td) => td.classList.toggle('hover', isMouseOver));
      }
    } else {
      const textContent = targetTD.textContent.trim();
      const tdElements = Array.from(document.querySelectorAll('td')).filter(
        (td) => td.textContent.trim() === textContent
      );
      if (textContent === '+')
        targetTD.classList.toggle('hover', isMouseOver)
      else
        tdElements.forEach((td) => td.classList.toggle('hover', isMouseOver));
    }
  }
}

export function showPopup(dataArray, type) {
  const removeOverlayAndPopup = () => {
    document.body.removeChild(overlay);
    document.body.removeChild(popup);
  }
  // Close popup when Escape is pressed
  document.onkeydown = (evt) => {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt)
      isEscape = (evt.key === "Escape" || evt.key === "Esc");
    else
      isEscape = (evt.keyCode === 27);
    if (isEscape && overlay.checkVisibility()) {
      removeOverlayAndPopup();
    }
  }
  // Create overlay
  const overlay = document.createElement('div');
  overlay.addEventListener('click', () => removeOverlayAndPopup());
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);

  // Create popup
  const popup = document.createElement('div');
  popup.classList.add('popup');

  // Create save button
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save changes';
  saveButton.addEventListener('click', () => removeOverlayAndPopup());

  // Create cancel button
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => removeOverlayAndPopup());

  // Create list for data
  const dataList = document.createElement('ul');
  dataArray.forEach((step) => {
    const item = document.createElement('li');
    item.innerHTML = step;
    dataList.appendChild(item);
  });

  // Append elements to popup
  popup.appendChild(dataList);
  popup.appendChild(cancelButton);
  popup.appendChild(saveButton);

  // Append popup to the body
  const placePopup = () => {
    console.log(window.scrollY, window.scrollX);
    popup.style.top = Math.floor(window.scrollY) + 50 + 'px';
    popup.style.left = `calc(${Math.floor(window.scrollX)}px + 50%)`;
  }
  placePopup();
  document.body.appendChild(popup);
  window.addEventListener('resize', () => placePopup());

  // Set type if applicable
  const dropdown = popup.querySelector('select');
  if (type) {
    dropdown.value = type;
    popup.classList.add(type.toLowerCase());
    // Add event listener to apply styles on change
    dropdown.addEventListener('change', () => popup.classList.value = `popup ${dropdown.value.toLowerCase()}`);
  }

  // Set height of the title element + focus
  const title = popup.querySelector('textarea');
  const setTitleSize = () => {
    title.style.height = title.scrollHeight - 5 + 'px';
    if (title.clientHeight < title.scrollHeight)
      title.style.height = title.scrollHeight + 2 + 'px';
  }
  if (title) {
    new ResizeObserver(setTitleSize).observe(title);
    title.addEventListener('input', () => setTitleSize());
    title.select();
  }
}
