const {Person, f1:func } = require("./person");
const my = require("./person");
// const {Person, f1} = require("./person")

const p1 = new Person('Billy',20);


console.log(p1.toJSON());
// console.log(f1(6));
console.log(func(6));
console.log(Person === my.Person);
// console.log(p1);
// console.log(p2);
