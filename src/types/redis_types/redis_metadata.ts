export interface RedisMetadata<T, M extends object> {
  object: T;
  metadata: M;
}
