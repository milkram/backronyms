var promise = () => {
	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			resolve('woot');
		}, 3000);
	})
}

let Object = {
	hello: promise
}

export default Object;