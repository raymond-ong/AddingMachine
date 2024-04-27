window.elRefs = {};
window.inputNumStr = "";
window.arrNums = [];
window.editingRowIndex = -1; // indicates which row being edited

const onLoad = () => {
	window.elRefs.inputScreen = document.getElementById('inputScreen');
	window.elRefs.tblBody = document.getElementById('tblBody');
	window.elRefs.totalTxt = document.getElementById('totalTxt');
	window.elRefs.btnClearInputScreen = document.getElementById('btnClearInputScreen');
	window.elRefs.inputScreen = document.getElementById('inputScreen');
}

const onClearInput = () => {
	window.inputNumStr = "";
	window.elRefs.inputScreen.innerText = "";
	window.elRefs.btnClearInputScreen.classList.add("hidden");
}

const onClickNum = (num) => {
	window.inputNumStr += num;
	window.elRefs.inputScreen.innerText = numberWithCommas(window.inputNumStr);
	window.elRefs.btnClearInputScreen.classList.remove("hidden");
}

const onClickDot = () => {
	window.inputNumStr += '.';
	window.elRefs.inputScreen.innerText = numberWithCommas(window.inputNumStr);
}


// Utility for putting thousands/millions separator
const numberWithCommas = (strVal) => {
    return strVal.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const formatMoneyString = (fVal) => {
	let roundedNumStr = fixPrecision(fVal, 2).toFixed(2);
	return numberWithCommas(roundedNumStr);
}

//https://stackoverflow.com/a/52473753/9952864
const fixPrecision = (value, precision) => {
    var nan = isNaN(value);

    if (nan || !value) {
        return nan ? '' : value;
    } else if (precision <= 0) {
        precision = 0;
    }

    //[1]
    //return parseFloat(Ext.Number.toFixed(parseFloat(value), precision));
    precision = precision || 0;
    var negMultiplier = value < 0 ? -1 : 1;

    //[2]
    var numWithExp = parseFloat(value + "e" + precision);
    var roundedNum = parseFloat(Math.round(Math.abs(numWithExp)) + 'e-' + precision) * negMultiplier;
    return parseFloat(roundedNum.toFixed(precision));
}

const onEnter = () => {
	var newNum = parseFloat(window.inputNumStr);
	var formattedNumStr = formatMoneyString(newNum);
	// [A] if in Edit Mode, just edit existing items
	if (window.editingRowIndex >=0 )
	{
		window.arrNums[window.editingRowIndex] = newNum;
		updateCalcRow(formattedNumStr, window.editingRowIndex);
		window.editingRowIndex = -1;
	}
	// [B] Not in Edit mode, add new Number
	else {				
		window.arrNums.push(newNum);	
		addNewRow(formattedNumStr, window.arrNums.length);		
	}

	onClearInput();

	// Update Sum
	calculateSum();
	
}

const calculateSum = () => {
	let sumCalc = window.arrNums.reduce((currSum, x) => currSum + x, 0);
	window.elRefs.totalTxt.innerHTML = formatMoneyString(sumCalc);
}

const addNewRow = (newNum, rowNum) => {	
	let idx = rowNum - 1;
	let newRow = `<tr id="row${idx}" class="tblRow rowVal" onclick="onEdit(${idx})">
					<td>${rowNum}</td>
					<td onclick="onDeleteRow(event, ${idx})">❌</td>
					<td id="rowVal${idx}"class="amtCell">${newNum}</td>
				</tr>`;
	window.elRefs.tblBody.innerHTML += newRow;
}

const updateCalcRow = (newNum, rowIdx) => {
	let findRowEl = document.getElementById(`row${rowIdx}`);
	if (!findRowEl) {
		alert('Unable to find Row HTML element to be updated');
		return;
	}
	findRowEl.classList.remove('rowEditMode');

	let findRowValEl = document.getElementById(`rowVal${rowIdx}`);
	if (!findRowValEl) {
		alert('Unable to find Row HTML element to be updated');
		return;
	}

	findRowValEl.innerText = formatMoneyString(newNum);
}

const onDeleteRow = (e, index) => {
	console.log("onDeleteRow", index);
	e.stopPropagation();
	if (index >= window.arrNums.length) {
		alert("Incorrect index to be deleted");
		return;
	}
	let nodeRow = document.getElementById(`row${index}`);
	if (!nodeRow) {
		alert("Cannot find row node to be deleted");
		return;
	}
	window.elRefs.tblBody.removeChild(nodeRow);
	window.arrNums.splice(index, 1);
	calculateSum();
}

const onEdit = (index) => {
	console.log("onEdit", index);
	// A. Clear any previous edit mode first
	if (window.editingRowIndex >= 0) {
		let rowElPrev = document.getElementById('row' + window.editingRowIndex);
		rowElPrev.classList.remove('rowEditMode');
	}

	// B. Set new edit mode
	let rowEl = document.getElementById('row' + index);
	if (!rowEl) {
		alert('Row element not found');
		return;
	}
	rowEl.classList.add("rowEditMode");
	window.editingRowIndex = index;

	// C. Set InputScreen
	if (index >= window.arrNums.length) {
		alert("Can't find edited number");
		return;
	}
	let valFind = window.arrNums[index];
	setInputScreenVal(valFind);

	// D. Set the global variable
	window.inputNumStr = valFind.toString();
}

const setInputScreenVal = (val) => {
	window.elRefs.inputScreen.innerText = numberWithCommas(val.toString());
	window.elRefs.btnClearInputScreen.classList.remove('hidden');
}

const onReset = () => {
	window.elRefs.inputScreen.innerText = "";
	window.elRefs.btnClearInputScreen.classList.add('hidden');
	window.inputNumStr = "";
	window.arrNums = [];
	window.editingRowIndex = -1;
	window.elRefs.tblBody.innerHTML = "";
	window.elRefs.totalTxt.innerHTML = "";
}