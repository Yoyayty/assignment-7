import { type Collection, type Db, MongoClient } from 'mongodb'
// We are importing the book type here, so we can keep our types consistent with the front end
import { type Book } from '../adapter/assignment-3'
import { publishMessage } from '../messaging'

// This is the connection string for the mongo database in our docker compose file
// We're using process.env to detect if a different mongo uri is set, primarily for testing purpuses
const uri = (global as any).MONGO_URI as string ?? 'mongodb://mongo'

// We're setting up a client, opening the database for our project, and then opening
// a typed collection for our books.
export const client = new MongoClient(uri)

// We're moving the setup of the database and collections into a function with a returned value,
// to allow us to isolate them in tests

export interface BookDatabaseAccessor {
  database: Db
  books: Collection<Book>
}

export interface AppBookDatabaseState {
  books: BookDatabaseAccessor
}

export async function getBookDatabase(dbName?: string): BookDatabaseAccessor {
  const databaseName = dbName ?? process.env.DB_NAME ?? 'books-service-db'
  const database = client.db(databaseName)
  const books = database.collection<Book>('books')

  return {
    database,
    books
  }
}

export async function addBook(book: Book): Promise<string> {
  const { books } = getBookDatabase()

  const result = await books.insertOne(book)
  const bookId = result.insertedId.toString()

  await publishMessage('book-added', {
    id: bookId,
    name: book.name,
    author: book.author
  })

  return bookId
}

if (import.meta.vitest !== undefined) {
  const { test, expect } = import.meta.vitest

  test('Can Setup Test DB', () => {
    const { database } = getBookDatabase()
    expect(database.databaseName, `URI: ${uri}, DB: ${database.databaseName}`).not.toEqual('mcmasterful-books')
  })
}
