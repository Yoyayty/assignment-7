import { type ZodRouter } from 'koa-zod-router'
import deleteBook from './delete'
import getBookRoute from './lookup'
import { type BookDatabaseAccessor } from '../src/database_access'
import { connectToRabbitMQ, publishMessage } from '../messaging'

export function setupBookRoutes(router: ZodRouter, books: BookDatabaseAccessor): void {
  // Setup Book Delete Route
  deleteBook(router, books)

  // Lookup Book
  getBookRoute(router, books)
}

(async () => {
  const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
  await connectToRabbitMQ(rabbitmqUrl);

  // Example: Publish a message when a book is created
  await publishMessage('books', { action: 'book_created', bookId: '12345' });
})();