window.elRefs = {};
window.inputNumStr = "";

const onLoad = () => {
	window.elRefs.inputScreen = document.getElementById('inputScreen');
}

const onClear = () => {
	window.inputNumStr = "";
	window.elRefs.inputScreen.innerText = "";
}

const onClickNum = (num) => {
	window.inputNumStr += num;
	window.elRefs.inputScreen.innerText = numberWithCommas(window.inputNumStr);

}

// Utility for putting thousands/millions separator
const numberWithCommas = (x) => {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const onEnter = () => {

}