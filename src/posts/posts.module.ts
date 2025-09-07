import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { ElasticsearchCustomModule } from '../elasticsearch/elasticsearch.module';

@Module({
  imports: [ElasticsearchCustomModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
