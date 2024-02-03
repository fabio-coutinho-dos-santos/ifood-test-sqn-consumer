export interface QueueServiceInterface {
  setup(): void;
  listen(queueUrl: string): void;
}
