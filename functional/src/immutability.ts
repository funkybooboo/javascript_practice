const s = "asdf";
const new_s = s.toUpperCase();

// bad
// const book: {title: string} = {title: ""};
// book.title = "asdfasdf";

// Update objects ---

const s_person = { name: "John" };
// const s_updated = Object.assign({}, s_person, { name: "Bob", age: 30 });
const s_updated = {...s_person, name: "Bob", age: 30};

const l_person = { 
    name: "John",
    address: {
        country: "USA",
        city: "Salt Lake City"
    }
};
const l_updated = {
    ...l_person, 
    address: { // deep copy
        ...l_person.address,
        city: "Eire"
    },
    name: "Bob", 
    age: 30
};

// ---

function add_back(numbers: number[], n: number): number[] {
    return [...numbers, n];
}
function add_front(numbers: number[], n: number): number[] {
    return [n, ...numbers];
}
function add_middle(numbers: number[], n: number, index: number): number[] {
    return [ ...numbers.slice(0, index), n, ...numbers.slice(index) ];
}

function remove(numbers: number[], n: number): number[] {
    return numbers.filter(m => m !== n);
}

function update(numbers: number[], n: number, new_n: number): number[] {
    return numbers.map(m => m === n ? new_n : n);
}
