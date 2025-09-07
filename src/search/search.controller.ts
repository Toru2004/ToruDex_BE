import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('posts')
  async searchPosts(@Query('q') query: string) {
    if (!query) return [];
    return await this.searchService.searchPosts(query); // đảm bảo trả về array
  }
}
