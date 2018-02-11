var spark = require('./Spark');

let newKey = spark.getNewKey();
console.log('Hello ' + newKey);

obj = {
    a: 'a',
    b: 'b',
    c: 'c'
}

console.log('Created obj:');
console.log(obj);
console.log('Adding then removing obj to ' + newKey + '...');

spark.write(newKey, obj).then(obj => {
    spark.delete(newKey).then(obj => {
        console.log(obj);
    })
});

var check = function(){
    spark.read(newKey).then(obj => {
        console.log('Final  value of ' + newKey);        
        console.log(obj);
    }) 
}

setTimeout(check, 2000);
