import { Injectable } from '@nestjs/common';
import { ElasticsearchServiceCustom } from '../elasticsearch/elasticsearch.service';

@Injectable()
export class PostsService {
  constructor(private readonly esService: ElasticsearchServiceCustom) {}

  async createPost(postData: any) {
    await this.esService.createPost({
      postId: postData.postId,
      username: postData.username,
      avatarUrl: postData.avatarUrl,
      content: postData.content,
      imageUrls: postData.imageUrls,
      likes: 0,
      comments: 0,
      shares: 0,
      uid: postData.uid,
      createdAt: new Date(),
    });

    return { success: true };
  }

  async updatePost(
    postId: string,
    updateData: Partial<{ content: string; imageUrls: string[] }>,
  ) {
    await this.esService.updatePost(postId, updateData);
    return { success: true };
  }

  async deletePost(postId: string) {
    await this.esService.deletePost(postId);
    return { success: true };
  }

  async searchPosts(query: string) {
    return this.esService.searchPosts(query);
  }
}
