export interface StorageServiceInterface {
  setup(): void
  uploadFile(catalog: any): Promise<any>;
}
