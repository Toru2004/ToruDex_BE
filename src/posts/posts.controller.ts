import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // API tạo post
  @Post()
  async createPost(@Body() postData: any) {
    return this.postsService.createPost(postData);
  }

  // API search
  @Get('search')
  async searchPosts(@Query('q') query: string) {
    return this.postsService.searchPosts(query);
  }
}
