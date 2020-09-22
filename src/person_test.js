const Person = require("./person")

const p1 = new Person('Billy',20);
const p2 = new Person;
console.log(p1.toJSON());
p1.name = 'Joe';
console.log(p2.toJSON());
console.log(p1.toJSON());
// console.log(p1);
// console.log(p2);
