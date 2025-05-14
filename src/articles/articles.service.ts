import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Cache } from 'cache-manager';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createArticleDto: CreateArticleDto, user: User) {
    const article = this.articlesRepository.create({
      ...createArticleDto,
      author: user,
    });
    return this.articlesRepository.save(article);
  }

  async findAll(page = 1, limit = 10, filters?: any) {
    const cacheKey = `articles_${page}_${limit}_${JSON.stringify(filters)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const where: any = {};
    if (filters?.authorId) where.author = { id: filters.authorId };
    if (filters?.startDate && filters?.endDate) {
      where.publicationDate = Between(
        new Date(filters.startDate),
        new Date(filters.endDate),
      );
    }

    const [items, count] = await this.articlesRepository.findAndCount({
      where,
      relations: ['author'],
      take: limit,
      skip: (page - 1) * limit,
    });

    await this.cacheManager.set(cacheKey, { items, count }, 600);
    return { items, count };
  }

  async findOne(id: number) {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    const cacheKey = `article_${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    if (article) await this.cacheManager.set(cacheKey, article, 600);
    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    if (!updateArticleDto || Object.keys(updateArticleDto).length === 0) {
      throw new Error('No update values provided');
    }
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    await this.articlesRepository.update(id, updateArticleDto);
    await this.cacheManager.del(`article_${id}`);
    return article;
  }

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    const article = await this.articlesRepository.findOne({
      where: { id },
    });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    await this.cacheManager.del(`article_${id}`);
    return this.articlesRepository.delete(id);
  }
}