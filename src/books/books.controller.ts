import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateBookDTO } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  private books = [];

  @Post()
  createBook(@Body() body: CreateBookDTO): string {
    const exists = this.books.some(
      (item) => item.id === body.id || item.title === body.title,
    );

    if (exists) {
      throw new HttpException(
        'Books already in database, can not create',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    this.books.push(body);
    console.log(this.books);

    return `Created book successfully with name: "${body.title}" and author: "${body.author}"`;
  }

  @Put()
  updateBook(@Body() body: CreateBookDTO): string {
    const book = this.books.find((item) => item.id === body.id);

    if (!book) {
      throw new HttpException(
        `Not found this book from id = ${body.id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    // const newValue = {title: body.title, author: body.author, publishedYear: body.publishedYear}
    Object.assign(book, body);
    console.log(this.books);

    return `Updated book successfully with name: "${body.title}" and author: "${body.author}"`;
  }

  @Patch(':id')
  patchBook(
    @Param('id') id: number,
    @Body() body: Partial<CreateBookDTO>,
  ): string {
    const book = this.books.find((item) => item.id === id);

    if (!book) {
      throw new HttpException(
        `Not found this book from id = ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    Object.assign(book, body);
    console.log(this.books);

    return `Patched book successfully with id = ${id}`;
  }

  @Get()
  findAll(): any {
    return this.books;
  }

  @Get(':id')
  getBookById(@Param('id') id: number): any {
    const book = this.books.find((item) => item.id === id);

    if (!book) {
      throw new HttpException(
        `Not found this book from id = ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return book;
  }

  @Delete(':id')
  deleteBook(@Param('id') id: number): any {
    const bookIndex = this.books.findIndex((item) => item.id === id);

    if (bookIndex === -1) {
      throw new HttpException(
        `Not found this book from id = ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    this.books.splice(bookIndex, 1);

    return `Deleted successfully book with id = ${id}`;
  }
}
