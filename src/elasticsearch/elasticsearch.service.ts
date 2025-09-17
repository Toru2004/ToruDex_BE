import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchServiceCustom {
  private readonly index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    await this.ensureIndex();
  }

  private async ensureIndex() {
    const exists = await this.elasticsearchService.indices.exists({
      index: this.index,
    });

    if (!exists) {
      await this.elasticsearchService.indices.create({
        index: this.index,
        body: {
          settings: {
            index: {
              max_ngram_diff: 10,
            },
            analysis: {
              analyzer: {
                vietnamese_custom: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'vietnamese_stop'],
                },
                vi_normalized: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'asciifolding'],
                },
                ngram_analyzer: {
                  type: 'custom',
                  tokenizer: 'ngram_tokenizer',
                  filter: ['lowercase', 'asciifolding'],
                },
              },
              filter: {
                vietnamese_stop: {
                  type: 'stop',
                  stopwords: '_vietnamese_' as any,
                },
              },
              tokenizer: {
                ngram_tokenizer: {
                  type: 'ngram',
                  min_gram: 3,
                  max_gram: 10,
                  token_chars: ['letter', 'digit'],
                },
              },
            },
          },
          mappings: {
            dynamic: false,
            properties: {
              postId: { type: 'keyword' },
              username: {
                type: 'text',
                analyzer: 'vietnamese_custom',
                fields: {
                  normalized: { type: 'text', analyzer: 'vi_normalized' },
                },
              },
              content: {
                type: 'text',
                analyzer: 'vietnamese_custom',
                fields: {
                  normalized: { type: 'text', analyzer: 'vi_normalized' },
                  vi_suggest: {
                    type: 'text',
                    analyzer: 'ngram_analyzer',
                    search_analyzer: 'vi_normalized',
                  },
                },
              },
              imageUrls: { type: 'keyword' },
            },
          },
        },
      });
    }
  }

  async createPost(post: any) {
    return this.elasticsearchService.index({
      index: this.index,
      id: post.postId,
      document: post,
    });
  }

  async updatePost(
    postId: string,
    updateData: Partial<{ content: string; imageUrls: string[] }>,
  ) {
    return this.elasticsearchService.update({
      index: this.index,
      id: postId,
      doc: updateData,
    });
  }

  async deletePost(postId: string) {
    return this.elasticsearchService.delete({
      index: this.index,
      id: postId,
    });
  }

  async searchPosts(query: string) {
    const buildQuery = (useFuzziness: boolean) => ({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query,
            fields: [
              'username',
              'username.normalized',
              'content',
              'content.normalized',
            ],
            ...(useFuzziness ? { fuzziness: 'AUTO' } : {}),
          },
        },
      },
    });

    const getTotal = (hits: any): number =>
      typeof hits.total === 'number' ? hits.total : hits.total?.value ?? 0;

    let { hits } = await this.elasticsearchService.search(buildQuery(false));

    if (getTotal(hits) === 0) {
      const fallback = await this.elasticsearchService.search(buildQuery(true));
      hits = fallback.hits;
    }

    return {
      results: hits.hits.map((hit: any) => hit._source),
    };
  }
}
