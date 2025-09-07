import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchServiceCustom {
  private readonly index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createPost(post: any) {
    return this.elasticsearchService.index({
      index: this.index,
      document: post,
    });
  }

  async searchPosts(query: string) {
    const { hits, suggest } = await this.elasticsearchService.search({
      index: this.index,
      body: {
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query,
                  fields: ['username', 'content'],
                  fuzziness: 'AUTO',
                },
              },
              {
                wildcard: {
                  content: {
                    value: `*${query.toLowerCase()}*`,
                  },
                },
              },
              {
                wildcard: {
                  username: {
                    value: `*${query.toLowerCase()}*`,
                  },
                },
              },
            ],
          },
        },
        suggest: {
          text: query,
          simple_phrase: {
            phrase: {
              field: 'content.trigram',
              size: 1,
              real_word_error_likelihood: 0.95,
              max_errors: 0.5,
              direct_generator: [
                {
                  field: 'content.trigram',
                  suggest_mode: 'always',
                },
              ],
            },
          },
        },
      },
    });

    return {
        results: hits.hits.map((hit: any) => hit._source),
        suggestions: Array.isArray(suggest?.simple_phrase?.[0]?.options)
            ? (suggest.simple_phrase[0].options as any[]).map((o: any) => o.text)
            : [],
    };
  }
}
