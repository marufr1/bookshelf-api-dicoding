const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (req, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = req.payload;

    if (name === undefined) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        res.code(400);

        return res;
    }

    if (pageCount < readPage) {
        const res = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        res.code(400);

        return res;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (pageCount === readPage);
    const newBook = {
        id, name, year, author, summary, publisher, pageCount,
        readPage, finished, reading, insertedAt, updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const res = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        res.code(201);

        return res;
    }

    const res = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    res.code(500);

    return res;
};

const getAllBooks = (req, h) => {
    const { name, reading, finished } = req.query;

    let filterBooks = books;

    if (name !== undefined) {
        filterBooks = filterBooks.filter((book) => book.name.toLowerCase());
    }

    if (reading !== undefined) {
        filterBooks = filterBooks.filter((book) => book.reading === !!Number(reading));
    }

    if (finished !== undefined) {
        filterBooks = filterBooks.filter((book) => book.finished === !!Number(finished));
    }

    const res = h.response({
        status: 'success',
        data: {
            books: filterBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    res.code(200);

    return res;
};

const getBooksById = (req, h) => {
    const { id } = req.params;
    const book = books.filter((thisBook) => thisBook.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const res = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    res.code(404);

    return res;
};

const editBooksById = (req, h) => {
    const { id } = req.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = req.payload;
    const updatedAt = new Date().toISOString();
    const indexBook = books.findIndex((book) => book.id === id);
    
    if (indexBook !== -1) {
        if (name === undefined) {
            const res = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            res.code(400);
            
            return res;
        }

        if (pageCount < readPage) {
            const res = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            res.code(400);

            return res;
        }

        const finished = (pageCount === readPage);

        books[indexBook] = {
            ...books[indexBook],
            name, year, author, summary, publisher,
            pageCount, readPage, finished, reading, updatedAt,
        };

        const res = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        res.code(200);

        return res;
    }

    const res = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    res.code(404);

    return res;
};

const deleteBooksById = (req, h) => {
    const { id } = req.params;

    const indexBook = books.findIndex((book) => book.id === id);

    if (indexBook !== -1) {
        books.splice(indexBook, 1);
        const res = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        res.code(200);

        return res;
    }

    const res = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    res.code(404);

    return res;
};

module.exports = {
    addBook, getAllBooks, getBooksById, editBooksById, deleteBooksById,
};