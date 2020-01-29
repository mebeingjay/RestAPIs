module.exports = {
	validateParams: function (...args) { // For verifying parameters are not undefined
		for (indices in args) {
			if (typeof args[indices] === "undefined" || args[indices] === "") return false;
		}
		return true;
	}
}