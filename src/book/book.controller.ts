import { Body, Controller, DefaultValuePipe, Get, Post, Query } from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./book.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller("book")
@ApiTags("Book")
export class BookController {
  constructor(
    private readonly bookService: BookService
  ) {}

  @Post("/")
  async create(
    @Body() createBookDto: CreateBookDto
  ) {
    const book = await this.bookService.create(createBookDto)
    return book 
  }

  @Get("/")
  async findAll(
    @Query("page", new DefaultValuePipe(1)) page: number = 1,
    @Query("limit", new DefaultValuePipe(10)) limit: number = 10,
    @Query("search", new DefaultValuePipe(null)) search?: string,
  ) {
    const books = await this.bookService.findAll(page, limit, search)
    return books
  }
}