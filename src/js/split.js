let sum = 0, share = []
const generateSplitDetailsTable = (index) => {
  const html =
  `
  <tr>
    <td><div class="split-details-list-people">Shobhit</div></td>
    <td><input type="checkbox" name="split-details-paid-by" class="split-details-paid-by-checkbox" value="${index}" checked=true></td>
    <td><input type="text" name="split-details-amount" class="split-details-amount" placeholder="0" oninput="updateValue(${index})"></td>
  </tr>
  `
  return html
}

const tableRef = document.getElementsByClassName("split-details-table")[0]
for (let i = 0; i < 20; ++i) {
  let newRow = tableRef.insertRow(tableRef.rows.length)
  newRow.innerHTML = generateSplitDetailsTable(i+1)
  share.push(0);
}

const updateValue = (index) => {
  let element = document.getElementsByClassName("split-details-table")[0].rows[index].cells[2].firstChild
  const el = +element.value
  if (isNaN(el)) {
    alert('not a number')
    element.value = '' + (share[index] === 0 ? '': share[index])
    return;
  }
  sum -= share[index];
  sum += el
  share[index] = el
  const submitAmount = document.getElementById("split-submit-amount")
  submitAmount.innerText = sum;
}

const split = () => {
  const checked = document.querySelectorAll(`.split-details-table input[name="split-details-paid-by"]:checked`)
  checked.forEach((el, ind, array) => {
    if (el.checked) {
      console.log(el.value)

    }  
  })
}
