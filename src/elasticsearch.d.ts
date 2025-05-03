// elasticsearch.d.ts
declare module "@elastic/elasticsearch" {
  interface SearchResponse<T> {
    body: {
      hits: {
        hits: Array<{ _source: T }>;
      };
    };
  }
}
