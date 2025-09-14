import { Body, Controller, Get, Post, Put, Delete, Query, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // API tạo post
  @Post()
  async createPost(@Body() postData: any) {
    return this.postsService.createPost(postData);
  }

  // API cập nhật post
  @Put(':id')
  async updatePost(
    @Param('id') postId: string,
    @Body() updateData: Partial<{ content: string; imageUrls: string[] }>,
  ) {
    return this.postsService.updatePost(postId, updateData);
  }

  // API xóa post
  @Delete(':id')
  async deletePost(@Param('id') postId: string) {
    return this.postsService.deletePost(postId);
  }

  // API search
  @Get('search')
  async searchPosts(@Query('q') query: string) {
    return this.postsService.searchPosts(query);
  }
}
