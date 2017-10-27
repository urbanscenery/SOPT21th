let jsonObject = {
	key1 : 'value1',
	key2 : 'value2'
}


let stringObj = JSON.stringify(jsonObject);
let reJsonObj = JSON.parse(stringObj);

console.log(typeof jsonObject);
console.log(typeof stringObj);
console.log(typeof reJsonObj);