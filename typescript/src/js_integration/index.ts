import { calculateTax } from "./tax";
// Either use a js comment in the js file or make a file.d.ts file to describe the types to the ts compiler
const tax = calculateTax(1000);
console.log(tax);

// to get declaration files for popular node modules
// npm i --save-dev @types/lodash