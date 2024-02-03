import { Repository } from "typeorm";
import { ProductModel } from "../infrastructure/database/typeorm/mongodb/entities/product.mongo.entity";

export default class GetProduct {
  constructor(private readonly productRepository: Repository<ProductModel>) {}
  async execute (ownerId: string) {
    const catalog = await this.productRepository.findOneBy({
      ownerId
    });
    return catalog;
  }
}
