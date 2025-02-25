import { Map } from 'immutable';

interface Book {
    title: string;
    is_published: boolean;
}

function publish(book: Map<string, any>): Map<string, any> {
    return book.set("is_published", true);
}

let book: Map<string, any> = Map({ title: "Harry Potter", is_published: false });

book = publish(book);

console.log(book.toJS());
