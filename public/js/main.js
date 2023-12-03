import { fetchDataFromServer, handleHover, showPopup } from './utils.js'

document.addEventListener('DOMContentLoaded', () => fetchDataFromServer());
document.addEventListener('mouseover', (event) => handleHover(event, true));
document.addEventListener('mouseout', (event) => handleHover(event, false));
document.addEventListener('click', (event) => {
  const targetCell = event.target.closest('td');
  if (targetCell?.cellIndex <= 1) {
    // Cell in the first or second column: Display the row data in a popup
    showPopup(Array.from(targetCell.parentNode.cells).map(cell => cell.querySelector('div').textContent));
  } else if (targetCell?.querySelector('select') && event.target.tagName !== 'SELECT') {
    // Cell after the second column: Display the details of the current cell
    showPopup([
      targetCell.querySelector('select').outerHTML,
      `<textarea>${targetCell.querySelector('div').textContent}</textarea>`
    ])
  } else if (targetCell && event.target.tagName !== 'SELECT') {
    // Cell "add" is pressed
    showPopup([`<textarea>${targetCell.querySelector('div').textContent}</textarea>`])
  }
});
