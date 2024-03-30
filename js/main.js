const books = []
const RENDER_EVENT = 'book-render'
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK-APPS";

function isStorageExist() {
    if (typeof Storage === undefined) {
      alert("browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  };

document.addEventListener('DOMContentLoaded', function(){
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
    });

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = parseInt(document.getElementById('inputBookYear').value);
    const checkCompleted = document.getElementById('inputBookIsComplete').checked;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, bookYear, checkCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function(){
    const unreadBook = document.getElementById('incompleteBookshelfList');
    unreadBook.innerHTML = '';

    const completeReadBook = document.getElementById('completeBookshelfList');
    completeReadBook.innerHTML = '';
    
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if(!bookItem.isCompleted) {
            unreadBook.append(bookElement);
        } else {
            completeReadBook.append(bookElement);
        }
    }
})

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p')
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('book_item');
    textContainer.append(textTitle, textAuthor, textYear);

    const book_shelf = document.createElement('div');
    book_shelf.classList.add('action');
    book_shelf.append(textContainer);
    book_shelf.setAttribute('id', `${bookObject.id}`)

    if(bookObject.isCompleted) {
        const uncompletedButton = document.createElement('button');
        uncompletedButton.classList.add('green');
        uncompletedButton.innerText = 'Belum selesai dibaca'

        uncompletedButton.addEventListener('click', function() {
            uncompletedFromList(bookObject.id);
        })

        const removeButton = document.createElement('button');
        removeButton.classList.add('red');
        removeButton.innerText = 'Hapus Buku';

        removeButton.addEventListener('click', function() {
            removeBookFromList(bookObject.id);
        })

        book_shelf.append(uncompletedButton, removeButton);
    } else {
        const completedButton = document.createElement('button');
        completedButton.classList.add('green');
        completedButton.innerText = 'Selesai dibaca'

        completedButton.addEventListener('click', function() {
            completedFromList(bookObject.id);
        })

        const removeButton = document.createElement('button');
        removeButton.classList.add('red');
        removeButton.innerText = 'Hapus Buku';

        removeButton.addEventListener('click', function() {
            removeBookFromList(bookObject.id);
        })
            
        book_shelf.append(completedButton, removeButton);
    }

    return book_shelf;
}

function findBook(bookId) {
    for(const bookItem of books) {
        if(bookItem.id == bookId) {
            return bookItem;
        }
    }
    return null;
}

function uncompletedFromList(bookId) {
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function completedFromList(bookId) {
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for(const index in books) {
        if(books[index].id == bookId) {
            return index;
        }
    }

    return -1;
};

function removeBookFromList(bookId) {
    const bookTarget = findBookIndex(bookId);

    if(bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
 
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
    document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
    }
)};