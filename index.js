window.elRefs = {};
window.inputNumStr = "";
window.arrNums = [];

const onLoad = () => {
	window.elRefs.inputScreen = document.getElementById('inputScreen');
	window.elRefs.tblBody = document.getElementById('tblBody');
	window.elRefs.totalTxt = document.getElementById('totalTxt');	
}

const onClearInput = () => {
	window.inputNumStr = "";
	window.elRefs.inputScreen.innerText = "";
}

const onClickNum = (num) => {
	window.inputNumStr += num;
	window.elRefs.inputScreen.innerText = numberWithCommas(window.inputNumStr);
}

const onClickDot = () => {
	window.inputNumStr += '.';
	window.elRefs.inputScreen.innerText = numberWithCommas(window.inputNumStr);
}


// Utility for putting thousands/millions separator
const numberWithCommas = (x) => {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const onEnter = () => {
	// Add new Number
	var newNum = parseFloat(window.elRefs.inputScreen.innerText);
	window.arrNums.push(newNum);	
	addNewRow(newNum, window.arrNums.length);
	onClearInput();

	// Update Sum
	let sumCalc = window.arrNums.reduce((currSum, x) => currSum + x, 0);
	window.elRefs.totalTxt.innerHTML = sumCalc;
}

const addNewRow = (newNum, rowNum) => {	
	let newRow =`<tr  class="tblRow"><td>${rowNum}</td><td class="amtCell">${newNum}</td></tr>`;
	window.elRefs.tblBody.innerHTML += newRow;
}

const calculateSum = () => {

}