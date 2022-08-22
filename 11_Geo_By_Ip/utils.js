export const ip2long = (ip) => {
	let components;
	if ((components = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/))) {
		let iplong = 0;
		let power = 1;
		for (let i = 4; i >= 1; i -= 1) {
			iplong += power * parseInt(components[i]);
			power *= 256;
		}
		return iplong;
	} else return -1;
};

const clearString = (str) => {
	return str.replace(/["\r\n]/g, '');
};

export const binarySearch = (arr, ipLong) => {
	let low = 0;
	let high = arr.length - 1;
	ipLong = parseInt(ipLong + '', 10);
	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		let [ipLongFrom, ipLongTo, countryCode, country] = arr[mid].split(',');
		ipLongFrom = parseInt(clearString(ipLongFrom), 10);
		ipLongTo = parseInt(clearString(ipLongTo), 10);
		if (ipLong >= ipLongFrom && ipLong <= ipLongTo) {
			countryCode = clearString(countryCode);
			country = clearString(country);
			return [countryCode, country];
		}
		if (ipLong < ipLongTo) {
			high = mid - 1;
		} else {
			low = mid + 1;
		}
	}
	return -1;
};
