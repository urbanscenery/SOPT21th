
var arr1 = [100, 200, 300];

arr1[5] = 600;

console.log(arr1);

arr1.push(700);

console.log(arr1);

var fun1 = function(){
	return 1+2;
}

arr1.push(fun1);

console.log(arr1);

console.log(arr1[7]);