
// basic classes
class Account {

    public nickname?: string;

    constructor(
        public readonly id: number,
        public owner: string,
        private _balance: number
    ) {}

    get balance() {
        return this._balance;
    }

    public deposit(amount: number): void {
        if (amount <= 0) throw new Error("invalid amount");
        // record a transaction
        this._balance += amount;
    }

    private calculateTax(): number {
        return this._balance * 1.2;
    }

}
const account1 = new Account(1, "Nate", 0);
account1.deposit(8);
console.log(typeof account1); // object
console.log(account1 instanceof Account); // true
console.log(account1.balance);

// index signatures
// @ts-ignore
class SeatAssignmentBad {
    // A1,   A2, ...
    // Nate, Bill
    A1: string,
    A2: string
}
class SeatAssignment {
    // index signature property
    [seatNumber: string]: string
}
let seats = new SeatAssignment();
seats.A1 = "Nate";
seats["A1"] = "Nate"; // the same
seats.A2 = "Bill";

// static members
class Ride {
    private static _activeRides: number = 0;

    constructor(
        public passenger: string,
        public pickUpLocation: string,
        public dropOffLocation: string
    ) {}

    static get activeRides() {
        return Ride._activeRides;
    }

    start() { Ride._activeRides++; }
    stop() { Ride._activeRides--; }
}

// inheritance, method overriding, polymorphism
class Person {
    constructor(
       public firstName: string,
       public lastName: string
    ) {}

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    walk(): void {
        console.log("walking");
    }

    talk(): void {
        console.log("talking");
    }
}
class Student extends Person {
    constructor(
        public id: string,
        firstName: string,
        lastName: string
    ) {
        super(firstName, lastName);
    }

    takeTest(): void {
        console.log("testing");
    }
}
class Teacher extends Person {
    // inherit constructor from Person

    override get fullName(): string {
        return `Professor ${super.fullName}`;
    }
}
function printNames(people: Person[]) {
    for (const person of people) {
        console.log(person.fullName);
    }
}
printNames([
    new Student("A023", "Nate", "Stott"),
    new Teacher("Vicki", "Allan")
]);

// abstract classes and methods
abstract class Shape { // abstract methods can only be in abstract classes
    protected constructor(
        public color: string
    ) {}

    abstract render(): void;
}
class Circle extends Shape {
    constructor(
        public radius: number,
        color: string
    ) {
        super(color);
    }

    override render(): void {
        console.log("rendering a circle");
    }

}

// interfaces
interface Calendar {
    name: string;
    addEvent(): void;
    removeEvent(): void;
}
interface CloudCalendar extends Calendar {
    sync(): void;
}
class NateCalendar implements CloudCalendar {
    constructor(
        public name: string
    ) {}

    addEvent(): void {
    }

    removeEvent(): void {
    }

    sync(): void {
    }
}
