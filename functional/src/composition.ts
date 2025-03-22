import { compose, pipe } from 'lodash/fp';

const input = "    JavaScript    ";
const output = "<div>" + input.trim() + "</div>";

const trim = (s: string): string => s.trim();
const wrapInDiv = (s: string): string => `<div>${s}</div>`;
const toLowerCase = (s : string): string => s.toLowerCase();

// const r = wrapInDiv(toLowerCase(trim(input)));
const transform = pipe(trim, toLowerCase, wrapInDiv);
const r: string = transform(input);

console.log(r);
