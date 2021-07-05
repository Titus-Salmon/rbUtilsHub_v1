// localStorage.removeItem('clickedRowData');
//begin table highlighter////////////////////////////////////////////////////////////////////
// const rsltTblBdy = document.getElementById("rsltTblBdy");
// let currentDate = new Date();
// console.log('currentDate==>', currentDate)

function highlight_row() {
  localStorage.removeItem('clickedRowData');
  const rsltTblBdy = document.getElementById("rsltTblBdy");
  let currentDate = new Date();
  console.log('currentDate==>', currentDate)

    let cells = rsltTblBdy.getElementsByTagName('td'); //targets all cells in table
    let rows = rsltTblBdy.getElementsByTagName('tr'); //targets all rows in table
    console.log('cells.length==>', cells.length)
    console.log('rows.length==>', rows.length)

    for (let i = 0; i < cells.length; i++) { //loop through all table cells
        // Take each cells
        // console.log('cells[' + i + ']', cells[i])
        // console.log('cells[' + i + '][' + i + ']', cells[i][i])
        // console.log('cells[i].parentNode==>', cells[i].parentNode)
        // console.log('cells[i].parentNode.childNodes==>', cells[i].parentNode.childNodes)
        // console.log('cells[i].parentNode.childNodes[0].innerHTML==>', cells[i].parentNode.childNodes[0].innerHTML)

        let clickCounter = 0; //set click counter for how many times a row has been clicked on to 0

        // do something on onclick event for cells
        cells[i].onclick = function (event) {
            localStorage.removeItem('clickedRowData'); //remove any previous cells data

            let cellStorage = [];

            // Get the row id where the cells exists
            // console.log('cells[i].parentNode==>', cells[i].parentNode)
            let rowId = cells[i].parentNode.rowIndex - 1;
            // console.log('rowId==>', rowId)

            let rowsNotSelected = rsltTblBdy.getElementsByTagName('tr');
            for (let row = 0; row < rowsNotSelected.length; row++) {
                rowsNotSelected[row].classList.value = ""
            }

            let rowSelected = rsltTblBdy.getElementsByTagName('tr')[rowId];
            console.log('rowSelected==>', rowSelected)
            console.log('rowSelected.classList.value==>', rowSelected.classList.value)

            rowSelected.onclick = function () {

                console.log('rowSelected==>', rowSelected)
                console.log('rowSelected was clicked ' + (clickCounter++) + ' times')
                console.log('clickCounter==>', clickCounter)
                if ((clickCounter++) % 2 == 0) { //if row is clicked an even number of times
                  //do we need to add +1 to clickCounter, in order to make this condition work?
                  //try (clickCounter +1) % 2 to test...
                  //no; try +2...
                  //no try ++
                    rowSelected.classList.value = ""; //unhighlight it
                } else {
                    rowSelected.classList.value = "row-hilite-toggle"; //otherwise, highlight it
                }
            }

            for (let j = 0; j < rowSelected.childNodes.length; j++) {
                cellStorage.push(rowSelected.childNodes[j].innerHTML);
            }

            localStorage.setItem("clickedRowData", JSON.stringify(cellStorage))
            console.log('localStorage==>', localStorage)
            console.log('cells[i].innerHTML==>', cells[i].innerHTML);

        }
    }

} //end of function
// window.onload = highlight_row;
//end table highlighter////////////////////////////////////////////////////////////////////

export {highlight_row}