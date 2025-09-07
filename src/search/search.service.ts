import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService) {}
    async searchPosts(query: string) {
    const { hits } = await this.esService.search({
        index: 'posts',
        body: {
        query: {
            match: { content: query },
        },
        },
    });

    return hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source,
    })); // phải là array chứ không bọc trong object
    }
}
