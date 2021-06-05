function resetRows() {
  const rsltTblBdy = document.getElementById("rsltTblBdy");
  let tblRows = rsltTblBdy.getElementsByTagName("tr"); //targets all rows in table

  for (let i = 0; i < tblRows.length; i++) {
    if (i % 2 == 0) tblRows[i].style.backgroundColor = "var(--surface2)";
  }
}

export { resetRows };
