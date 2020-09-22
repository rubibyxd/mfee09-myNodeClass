class Person {
    constructor(name ='noname',age = 20){
        this.name = name;
        this.age = age;
    }
    toJSON(){
        console.log('----toJSON()');
        const obj = {
            name: this.name,
            age: this.age,
        };
        return JSON.stringify(obj);
    }
}

// module.exports = Person;
module.exports = {
    Person,
    f1:a=>a*a,
};

console.log('----01');