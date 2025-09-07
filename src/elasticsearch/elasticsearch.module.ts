import { Module } from '@nestjs/common';
import { ElasticsearchModule as NestElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchServiceCustom } from './elasticsearch.service';

@Module({
  imports: [
    NestElasticsearchModule.register({
      node: 'http://localhost:9200', // endpoint Elasticsearch
    }),
  ],
  providers: [ElasticsearchServiceCustom],
  exports: [ElasticsearchServiceCustom],
})
export class ElasticsearchCustomModule {}
