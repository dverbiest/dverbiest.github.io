import { fetchDataFromServer, handleHover, showPopup } from './utils.js';

document.addEventListener('DOMContentLoaded', () => fetchDataFromServer());
document.addEventListener('mouseover', (event) => handleHover(event, true));
document.addEventListener('mouseout', (event) => handleHover(event, false));
document.addEventListener('click', (event) => {
  const targetCell = event.target.closest('td');
  const targetDiv = targetCell?.querySelector('div');
  const targetDropdown = targetCell?.querySelector('select');
  const dropdownClicked = event.target.tagName === 'SELECT';
  const inputClicked = event.target.tagName === 'INPUT';
  if (targetCell?.cellIndex <= 1) {
    // Cell in the first or second column: Display the row data in a popup
    const info = Array.from(targetCell.parentNode.cells).map(cell => cell.querySelector('div').textContent);
    info.pop() // Remove the last "add" cell
    showPopup(info);
  } else if (targetDropdown && !dropdownClicked && !inputClicked) {
    // Cell after the second column: Display the details of the current cell
    showPopup([targetDropdown.outerHTML, `<textarea>${targetDiv.textContent}</textarea>`], targetDropdown.value);
  } else if (targetCell && !dropdownClicked && !inputClicked) {
    // Cell "add" is pressed
    showPopup(['<select><option value="API">API</option><option value="Portal">Portal</option><option value="Salesforce">Salesforce</option></select>',
      `<textarea></textarea>`], 'API');
  }
});
