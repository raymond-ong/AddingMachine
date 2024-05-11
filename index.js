if ("serviceWorker" in navigator) {
	console.log("SW in navigator!");
	navigator.serviceWorker.register("sw.js").then( (registration) => {
		console.log("SW Registered!", registration);
	})
	.catch(err => {
		console.log("SW Registered failed!", err);
	})
}
console.log("SW check done");

window.elRefs = {};
window.inputNumStr = "";
window.arrNums = {};
window.editingRowId = null; // indicates which row being edited

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
	console.log('onEnter', window.inputNumStr);
	if (!window.inputNumStr) {
		return;
	}
	var newNum = parseFloat(window.inputNumStr);
	var formattedNumStr = formatMoneyString(newNum);
	// [A] if in Edit Mode, just edit existing items
	if (window.editingRowId)
	{
		window.arrNums[window.editingRowId] = newNum;
		updateCalcRow(formattedNumStr, window.editingRowId);
		window.editingRowId = null;
	}
	// [B] Not in Edit mode, add new Number
	else {
		let newId = uuidv4();		
		window.arrNums[newId] = newNum;
		addNewRow(formattedNumStr, newId);		
	}

	onClearInput();

	// Update Sum
	calculateSum();
	
}

const calculateSum = () => {
	let sumCalc = Object.values(window.arrNums).reduce((currSum, x) => currSum + x, 0);
	window.elRefs.totalTxt.innerHTML = formatMoneyString(sumCalc);
}

const addNewRow = (newNum, newId) => {
	let numRows = Object.values(window.arrNums).length;
	let newRow = `<tr id="row-${newId}" class="tblRow rowVal" onclick="onEdit('${newId}')">
					<td></td>
					<td onclick="onDeleteRow(event, '${newId}')">❌</td>
					<td id="rowVal-${newId}"class="amtCell">${newNum}</td>
				</tr>`;
	window.elRefs.tblBody.innerHTML += newRow;
	// scroll to the bottom of table
	let lastRow = document.getElementById(`row-${newId}`);
	lastRow.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

const updateCalcRow = (newNum, rowId) => {
	let findRowEl = document.getElementById(`row-${rowId}`);
	if (!findRowEl) {
		alert('Unable to find Row HTML element to be updated');
		return;
	}
	findRowEl.classList.remove('rowEditMode');

	let findRowValEl = document.getElementById(`rowVal-${rowId}`);
	if (!findRowValEl) {
		alert('Unable to find Row HTML element to be updated');
		return;
	}

	findRowValEl.innerText = formatMoneyString(newNum);
}

const onDeleteRow = (e, idDeleted) => {
	console.log("onDeleteRow", idDeleted);
	e.stopPropagation();
	if (window.arrNums[idDeleted] === undefined) {
		alert("Incorrect id to be deleted");
		return;
	}
	let nodeRow = document.getElementById(`row-${idDeleted}`);
	if (!nodeRow) {
		alert("Cannot find row node to be deleted");
		return;
	}
	// If any row is in edit mode, clear it to avoid confusion for the user
	clearEditMode();
	
	window.elRefs.tblBody.removeChild(nodeRow);
	delete window.arrNums[idDeleted];
	calculateSum();
}

const clearEditMode = () => {
	if (!window.editingRowId) {
		return;
	}
	let findRowEl = document.getElementById(`row-${window.editingRowId}`);
	if (!findRowEl) {
		alert('Unable to clear Edit Mode of row');
		return;
	}
	findRowEl.classList.remove('rowEditMode');	
	onClearInput();
	window.editingRowId = null;
}

const onEdit = (editingRowId) => {
	console.log("onEdit", editingRowId);
	// A. Clear any previous edit mode first
	if (window.editingRowId) {
		let rowElPrev = document.getElementById('row-' + window.editingRowId);
		rowElPrev.classList.remove('rowEditMode');
	}

	// B. Set new edit mode
	let rowEl = document.getElementById('row-' + editingRowId);
	if (!rowEl) {
		alert('Row element not found');
		return;
	}
	rowEl.classList.add("rowEditMode");

	// C. Set InputScreen
	let valFind = window.arrNums[editingRowId];
	if (valFind === undefined) {
		alert("Can't find edited number");
		return;
	}
	setInputScreenVal(valFind);

	// D. Set the global variable
	window.inputNumStr = valFind.toString();
	window.editingRowId = editingRowId
}

const setInputScreenVal = (val) => {
	window.elRefs.inputScreen.innerText = numberWithCommas(val.toString());
	window.elRefs.btnClearInputScreen.classList.remove('hidden');
}

const onReset = () => {
	window.elRefs.inputScreen.innerText = "";
	window.elRefs.btnClearInputScreen.classList.add('hidden');
	window.inputNumStr = "";
	window.arrNums = {};
	window.editingRowId = null;
	window.elRefs.tblBody.innerHTML = "";
	window.elRefs.totalTxt.innerHTML = "";
}

// For generating unique id using builtin functions
const uuidv4 = () => {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}