#include <iostream>

using namespace std;

class Book {
public:
    Book(char* title, char* author) : borrowed(0) {
        strcpy(this->title, title);
        strcpy(this->author, author);
    }
    char* getTitle() { return title; }
    char* getAuthor() { return author; }
    int isBorrowed() { return borrowed; }
    void borrow() { borrowed = 1; }
    void returnBook() { borrowed = 0; }
private:
    char title[100];
    char author[100];
    int borrowed;
};

class LibraryMember {
public:
    LibraryMember(char* name, int memberId) {
        strcpy(this->name, name);
        this->memberId = memberId;
        borrowedBooks = NULL;
        numBorrowedBooks = 0;
    }
    char* getName() { return name; }
    int getMemberId() { return memberId; }
    void borrowBook(Book* book) {
        Book** newBorrowedBooks = new Book*[numBorrowedBooks + 1];
        for (int i = 0; i < numBorrowedBooks; i++) {
            newBorrowedBooks[i] = borrowedBooks[i];
        }
        newBorrowedBooks[numBorrowedBooks] = book;
        delete[] borrowedBooks;
        borrowedBooks = newBorrowedBooks;
        numBorrowedBooks++;
    }
    void returnBook(Book* book) {
        for (int i = 0; i < numBorrowedBooks; i++) {
            if (borrowedBooks[i] == book) {
                Book** newBorrowedBooks = new Book*[numBorrowedBooks - 1];
                for (int j = 0; j < i; j++) {
                    newBorrowedBooks[j] = borrowedBooks[j];
                }
                for (int j = i + 1; j < numBorrowedBooks; j++) {
                    newBorrowedBooks[j - 1] = borrowedBooks[j];
                }
                delete[] borrowedBooks;
                borrowedBooks = newBorrowedBooks;
                numBorrowedBooks--;
                break;
            }
        }
    }
    Book** getBorrowedBooks() { return borrowedBooks; }
    int getNumBorrowedBooks() { return numBorrowedBooks; }
private:
    char name[100];
    int memberId;
    Book** borrowedBooks;
    int numBorrowedBooks;
};

class Library {
public:
    void addBook(Book* book) {
        Book** newBooks = new Book*[numBooks + 1];
        for (int i = 0; i < numBooks; i++) {
            newBooks[i] = books[i];
        }
        newBooks[numBooks] = book;
        delete[] books;
        books = newBooks;
        numBooks++;
    }
    void addMember(LibraryMember* member) {
        LibraryMember** newMembers = new LibraryMember*[numMembers + 1];
        for (int i = 0; i < numMembers; i++) {
            newMembers[i] = members[i];
        }
        newMembers[numMembers] = member;
        delete[] members;
        members = newMembers;
        numMembers++;
    }
    int borrowBook(LibraryMember* member, Book* book) {
        if (!book->isBorrowed()) {
            book->borrow();
            member->borrowBook(book);
            cout << book->getTitle() << " borrowed by " << member->getName() << endl;
            return 1;
        } else {
            cout << book->getTitle() << " is already borrowed" << endl;
            return 0;
        }
    }
    int returnBook(LibraryMember* member, Book* book) {
        for (int i = 0; i < member->getNumBorrowedBooks(); i++) {
            if (member->getBorrowedBooks()[i] == book) {
                book->returnBook();
                member->returnBook(book);
                cout << book->getTitle() << " returned by " << member->getName() << endl;
                return 1;
            }
        }
        cout << book->getTitle() << " not found in " << member->getName() << "'s borrowed books" << endl;
        return 0;
    }
    void displayBooksBorrowedByMember(LibraryMember* member) {
        if (member->getNumBorrowedBooks() > 0) {
            cout << member->getName() << " has borrowed the following books:" << endl;
            for (int i = 0; i < member->getNumBorrowedBooks(); i++) {
                cout << "- " << member->getBorrowedBooks()[i]->getTitle() << " by " << member->getBorrowedBooks()[i]->getAuthor() << endl;
            }
        } else {
            cout << member->getName() << " has not borrowed any books" << endl;
        }
    }
private:
    Book** books;
    int numBooks;
    LibraryMember** members;
    int numMembers;
};

int main() {
    Library library;
    Book book1("The Great Gatsby", "F. Scott Fitzgerald");
    Book book2("To Kill a Mockingbird", "Harper Lee");
    LibraryMember member1("John Doe", 12345);
    LibraryMember member2("Jane Smith", 67890);

    library.addBook(&book1);
    library.addBook(&book2);
    library.addMember(&member1);
    library.addMember(&member2);

    library.borrowBook(&member1, &book1);
    library.borrowBook(&member2, &book2);

    library.displayBooksBorrowedByMember(&member1);

    library.returnBook(&member1, &book1);

    library.displayBooksBorrowedByMember(&member1);

    return 0;
}
