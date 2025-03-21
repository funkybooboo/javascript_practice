// object literal
circle = {
    radius: 1,
    location: {
        x: 1,
        y: 1
    },
    draw: function () {
        console.log("draw");
    }
}

// factory function
function createCircle(radius) {
    return {
        radius: radius,
        location: {
            x: 1,
            y: 1
        },
        draw: function () {
            console.log("draw");
        }
    }
}

// constructor function
function Circle(radius) {
    this.radius = radius;
    this.location = {
        x: 1,
        y: 1
    };
    this.draw = function () {
        console.log("draw");
    };
}

function StopWatch1() {
    let startTime;
    let endTime;
    let running = false;
    let duration = 0;

    this.start = function () {
        if (running) throw new Error("Stopwatch is already running.");
        running = true;
        startTime = new Date();
    };

    this.stop = function () {
        if (!running) throw new Error("Stopwatch is not running.");
        running = false;
        endTime = new Date();

        const seconds = (endTime.getTime() - startTime.getTime()) / 1000;
        duration += seconds;
    };

    this.reset = function () {
        startTime = null;
        endTime = null;
        running = false;
        duration = 0;
    };

    this.show = function () {
        console.log(this.duration);
    }

    Object.defineProperty(this, 'duration', {
        get: function () { return duration; }
    });
}

let person = { name: "Nate" }
let objectBase = Object.getPrototypeOf(person);
let descriptor = Object.getOwnPropertyDescriptor(objectBase, "toString");
console.log(descriptor);
Object.defineProperty(person, "name", {
    writable: false,
    enumerable: false,
    configurable: false
});

function Square(width) {
    // Instance members
    this.width = width;
}
// Prototype members
Square.prototype.draw = function () {
    console.log("draw")
}
Square.prototype.toString = function () {
    return "Square with width " + this.width;
}

// This can be done but its bad
function StopWatch2() {
    let startTime = 0;
    let endTime = 0;
    let running = false;
    let duration = 0;
    Object.defineProperty(this, 'startTime', {
        get: function () { return startTime; },
        set: function (value) { startTime = value }
    });
    Object.defineProperty(this, 'endTime', {
        get: function () { return endTime; },
        set: function (value) { endTime = value }
    });
    Object.defineProperty(this, 'running', {
        get: function () { return running; },
        set: function (value) { running = value }
    });
    Object.defineProperty(this, 'duration', {
        get: function () { return this.duration; },
        set: function (value) { duration = value }
    });
}
StopWatch2.prototype.start = function () {
    if (this.running) throw new Error("Stopwatch is already running.");
    this.running = true;
    this.startTime = new Date();
};
StopWatch2.prototype.stop = function () {
    if (!this.running) throw new Error("Stopwatch is not running.");
    this.running = false;
    this.endTime = new Date();
    const seconds = (this.endTime.getTime() - this.startTime.getTime()) / 1000;
    this.duration += seconds;
};
StopWatch2.prototype.reset = function () {
    this.startTime = null;
    this.endTime = null;
    this.running = false;
    this.duration = 0;
};
StopWatch2.prototype.show = function () {
    console.log(this.duration);
};

// prototypical inheritance
function extend(Child, Parent) {
    Child.prototype = Object.create(Parent.prototype);
    Child.constructor = Child; // inheritance
}
function Shape(color) {
    this.color = color;
}
Shape.prototype.draw = function () {
    console.log("draw")
};
Shape.prototype.duplicate = function () {
    console.log("duplicate");
};
function Triangle(width, color) {
    Shape.call(this, color); // super constructor
    this.width = width;
}
extend(Triangle, Shape); // must extend before adding more methods to the prototype of child
Triangle.prototype.duplicate = function () { // override super method
    console.log("override duplicate triangle");
};
function Hexagon(height, color) {
    Shape.call(this, color);
    this.height = height;
}
extend(Hexagon, Shape);
Hexagon.prototype.duplicate = function () { // override super method
    console.log("override duplicate hexagon");
};

// polymorphism
const shapes = [
    new Triangle(10, "red"),
    new Hexagon(5, "blue")
];
for (let shape of shapes) {
    shape.duplicate();
}

// mixins / composition
function mixin(target, ...sources) {
    Object.assign(target.prototype, ...sources);
}
const canEat = {
    hunger: 0,
    eat: function () {
        this.hunger--;
        console.log("eating");
    }
};
const canWalk = {
    distance: 0,
    walk: function () {
        this.distance++;
        this.hunger++;
        console.log("walking");
    }
};
const canSwim = {
    distance: 0,
    swim: function () {
        this.distance++;
        this.hunger++;
        console.log("swimming");
    }
};
function Person() {
}
mixin(Person, canEat, canWalk);
function Goldfish() {
}
mixin(Goldfish, canEat, canWalk);
const person1 = new Person();
const goldfish = new Goldfish();

// classes
class Dog {
    constructor(name, age=1) {
        this._name = name;
        this._age = age;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        if (typeof value === "string") this._name = value;
    }
    get age() {
        return this._age;
    }
    set age(value) {
        if (!isNaN(value)) this._age = value;
    }
    // instance method
    move() {
        console.log("move");
    }
    // static method
    static parse(str) {
        const name = JSON.parse(str);
        return new Dog(name);
    }
}
const dog = new Dog("Red");
const dog1 = Dog.parse("{ 'name': 'Bill' }")

// function declaration
function sayHello() {}
// function expression
const sayGoodbye = function () {};

// class declaration
class Cat {}
// class expression
const cat = class {};

// ES6 way to do inheritance
class Shape1 {
    constructor() {
    }
}
class Circle1 extends Shape1 {
    constructor() {
        super();
    }
}


