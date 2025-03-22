// type aliases
type Employee = {
    readonly id: number,
    name: string,
    fax?: string,
    work: (job: string) => void
};
const employee: Employee = {
    id: 1,
    name: "Nate",
    work: (job: string) => console.log(`Working on ${job}`)
};

// Union types
function kgToLbs(weight: number | string): number {
    if (typeof weight === "number") {
        return weight * 2.2;
    }
    return parseInt(weight) * 2.2;
}
kgToLbs(10);
kgToLbs("10kg");

// Intersection types
type Draggable = {
    drag: () => void
};
type Resizeable = {
    resize: () => void
};
type UIWidget = Draggable & Resizeable;
const textBox: UIWidget = {
    drag(): void {},
    resize(): void {}
};

// literal types
type Quantity = 50 | 100;
const quantity1: Quantity = 100;
const quantity2: Quantity = 50;

// nullables types
function greet(name: string | null) {
    if (name) {
        console.log(`Hello ${name.toUpperCase()}`);
    }
    else {
        console.log("Hello");
    }
}

// optional chaining
// optional property access operator
type Customer = {
    birthday: Date
}
function getCustomer(id: number): Customer | null {
    return id === 0 ? null : {birthday: new Date()};
}
const customer = getCustomer(0);
console.log(customer?.birthday?.getFullYear());
// optional element access operator
const numbers: number[] | null = [1, 2, 3];
const a = numbers?.[0];
// optional call
const log: Function | null = (message: string): void => { console.log(message); }
log?.("hello");

// nullish coalescing operator
const speed: number | null = null;
const ride = {
    speed: speed ?? 30
}

// type assertions
const phone1 = document.getElementById("phone") as HTMLInputElement;
const phone2 = <HTMLInputElement> document.getElementById("phone");

// the unknown type
function render(document: unknown) {
    document.move(); // doesn't let us use unknown methods where any does
    if (typeof document === "string") {
        document.toUpperCase();
    }
}

// the never type
function process(): never {
    while (true) {
        // read from a queue
    }
}
function reject(message: string): never {
    throw new Error(message); // always throw an error
}
