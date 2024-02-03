import { StorageServiceInterface } from "../infrastructure/storage/@shared/storage.service.interface";

export default class StoreCatalog {
  constructor(private readonly storageService: StorageServiceInterface) {}
  async execute(product: unknown) {
    try {
      const catalog = this.buildCatalog(product)
      const result = await this.storageService.uploadFile(catalog);
      console.log(result);
    } catch (error: unknown) {
      console.log(String(error));
    }
  }

  private buildCatalog(product: any) {
    const catalog = {
      owner: product.ownerId,
      catalog: [{
        category_title: product.category.title,
        category_description: product.category.description,
        itens: [{
          title: product.title,
          description: product.description,
          price: product.price
        }]
      }]
    }
    return catalog
  }
}
