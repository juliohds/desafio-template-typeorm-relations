import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const product = await this.productsRepository.findByName(name);
    if (product) {
      throw new AppError('Product already exists');
    }

    const newProduct = await this.productsRepository.create({
      name,
      price,
      quantity,
    });

    if (!newProduct) {
      throw new AppError('Create new product Fail');
    }
    return newProduct;
  }
}

export default CreateProductService;
