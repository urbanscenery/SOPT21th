
var arr1 = [100, 200, 300];

arr1[5] = 600;

console.log(arr1);

arr1.push(700);
delete arr1[0];

console.log(arr1);

var arr2 = [5,6,7];
console.log(arr2.length);
arr2.name = "property test!";
console.log(arr2.length);

console.log(arr2);
arr2.length = 2;
console.log(arr2);
arr2.size = 10;

for(var index in arr2){
	console.log(index, arr2[index]);
}