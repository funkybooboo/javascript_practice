import { produce } from 'immer';

interface Book {
    title: string;
    is_published: boolean;
}

function publish(book: Book): Book {
    return produce(book, draft => {
        draft.is_published = true;
    });
}

let book: Book = { title: "Harry Potter", is_published: false };

book = publish(book);

console.log(book);
