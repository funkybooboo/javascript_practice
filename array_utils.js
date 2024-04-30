
function range(min, max) {
    const array = [];
    for (let i = min; i <= max; i++) {
        array.push(i);
    }
    return array;
}

function includes(array, s) {
    for (let a of array) {
        if (a === s) return true;
    }
    return false;
}

function except(array, es) {
    const output = [];
    for (let a of array) {
        if (!es.includes(a)) output.push(a);
    }
    return output;
}

function move(array, index, offset) {
    if (index < 0 || array >= array.length) {
        console.error("Invalid index");
        return;
    }
    const end = index + offset;
    if (offset === 0 || end < 0 || end >= array.length) {
        console.error("Invalid offset");
        return;
    }

    const output = [...array];
    const e = output.splice(index, 1)[0];
    output.splice(end, 0, e);

    return output;
}

function count(array, s) {
    return array.reduce((acc, a) => {
        if (s === a) return acc + 1;
        return acc;
    }, 0);
}

function max(array) {
    return array.reduce((max, a) => (a > max) ? a : max);
}

function min(array) {
    return array.reduce((min, a) => (a < min) ? a : min);
}

const exampleMovies = [
    { title: 'a', year: 2024, rating: 4.5 },
    { title: 'b', year: 2024, rating: 4.7 },
    { title: 'c', year: 2022, rating: 4 },
    { title: 'd', year: 2024, rating: 4.2 },
    { title: 'e', year: 2023, rating: 4.5 },
];
function filter(movies, year, rating) {
    return movies
        .filter(m => m.year === year && m.rating > rating)
        .sort((m1, m2) => m1.rating - m2.rating)
        .reverse()
        .map(m => m.title);
}
function sort(movies) {
    const minYear = Math.min(...movies.map(movie => movie.year));
    const maxYear = Math.max(...movies.map(movie => movie.year));
    const years = [];
    for (let i = minYear; i <= maxYear; i++) {
        years.push([]);
    }
    for (let movie of movies) {
        years[movie.year - minYear].push(movie);
    }
    for (let year of years) {
        year.sort((m1, m2) => m1.rating - m2.rating);
    }
    return years;
}
