import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './book.dto';

@Injectable()
export class BookService {
  @InjectRepository(Book) private bookRepository: Repository<Book>;

  async create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create({
      ...createBookDto,
    });
    return await this.bookRepository.save(book);
  }

  async findAll(page: number, limit: number, search?: string) {
    const query = this.bookRepository
      .createQueryBuilder('book')
      .select([
        'book.id',
        'book.title',
        'book.writer',
        'book.coverImg',
        'book.point',
        'book.tags',
      ])
      .limit(limit)
      .offset((page - 1) * limit);
    
    if (search) {
      query.where('book.title LIKE :search', { search: `%${search}%` });
      query.orWhere('book.writer LIKE :search', { search: `%${search}%` });
      query.orWhere('book.tags LIKE :search', { search: `%${search}%` });
    }
    return await query.getMany();
  }

  async findOne(id: string) {
    return await this.bookRepository.findOneBy({ id });
  }
}
