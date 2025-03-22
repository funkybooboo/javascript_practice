import * as inspector from "node:inspector";

let sales: number = 123_456;
let course: string = "TypeScript";
let is_published: boolean = true;

// BAD but allowed in ts
let level;
level = 1;
level = "a";

// functions
function render(document: string): void {
    console.log(document);
}

function calculateTax(income: number, taxYear=2024): number {
    if (taxYear < 2024) {
        return income * 1.2;
    }
    return income * 1.3;
}

// arrays
let numbers_good: number[] = [1, 2, 3];

// tuples
let user: [number, string] = [1, "Nate"];

// enums
const enum Size {
    small,
    medium,
    large
}

// objects
const employee: {
    readonly id: number,
    name: string,
    fax?: string,
    work: (job: string) => void
} = {
    id: 1,
    name: "Nate",
    work: (job: string) => console.log(`Working on ${job}`)
}
