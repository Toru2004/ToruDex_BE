import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200', // URL Elasticsearch
    }),
  ],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
