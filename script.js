function addRow() {
  var formData = document.getElementById("data").value;
  var table = document.getElementById("dataTable");

  // Add a new row to the table
  var row = table.insertRow(table.rows.length);
  var cell = row.insertCell(0);
  cell.innerHTML = formData;

  // Clear the input field
  document.getElementById("data").value = "";
}
