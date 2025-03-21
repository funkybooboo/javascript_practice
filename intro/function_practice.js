
// Function Declaration
function walk() {
    console.log("walk");
}

// Anonymous Function Expression
const run = function () {
    console.log("run");
};

function sum1(discount, ...prices) {
    const total = prices.reduce((a, b) => a + b);
    return total * (1 - discount);
}

function interest(principal, rate=3.5, years=5) {
    return principal * rate / 100 * years;
}

const person = {
    firstName: "Nate",
    lastName: "Stott",
    get fullName() {
        return `${person.firstName} ${person.lastName}`
    },
    set fullName(fullName) {
        if (typeof fullName !== "string") {
            throw new Error("Value is not a string.")
        }
        const parts = fullName.splice(" ");
        if (parts.length !== 2) {
            throw new Error("Needs to be in the form 'John Doe'")
        }
        this.firstName = parts[0];
        this.lastName = parts[1];
    }
};

function Video1(title, tags) {
    this.title = title;
    this.tags = tags;
    this.showTags = function () {
        this.tags.forEach(function (tag) {
            console.log(this.title, tag);
        }.bind(this));
    }
}

function Video2(title, tags) {
    this.title = title;
    this.tags = tags;
    this.showTags = function () {
        this.tags.forEach(tag => {
            console.log(this.title, tag);
        });
    }
}

function sum2(...items) {
    if (items.length === 1 && Array.isArray(items[0])) {
        items = [...items[0]];
    }
    return items.reduce((a, b) => a + b);
}

circle = {
    radius: 2,
    get area() {
        return Math.PI * this.radius * this.radius;
    }
}


function countOccurrences(array, s) {
    if (!Array.isArray(array)) throw new Error("array must be of type Array.")
    return array.reduce((acc, c) => {
        if (s === c) acc += 1;
        return acc;
    });
}
function testCountOccurrences() {
    try {
        const numbers = [1,2,2,4];
        const count1 = countOccurrences(numbers, 2);
        const count2 = countOccurrences(null, 2);
    }
    catch (e) {
        console.log(e.message);
    }
}
