// function add(a: number, b: number) {
//     return a + b;
// }

function add(a: number) {
    return function (b: number) {
        return a + b;
    };
}

const sub = (a: number) => (b: number) => a - b;

add(2)(4);

const add1 = add(1);
add1(5);

import { pipe } from 'lodash/fp';

const trim = (s: string) => s.trim();
const wrap = (t: string) => (s: string) => `<${t}>${s}</${t}>`;
const toLowerCase = (s : string) => s.toLowerCase();

// const r = wrapInDiv(toLowerCase(trim(input)));
const transform = pipe(trim, toLowerCase, wrap("div"));
const r: string = transform("    TypeScript     ");

console.log(r);

