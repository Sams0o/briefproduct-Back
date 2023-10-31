import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    console.log('SERVICE DTO:', createProductDto);
    const product = new Product();
    product.name = createProductDto.name;
    product.price = createProductDto.price;
    product.quantity = createProductDto.quantity;
    product.user = createProductDto.user_id;
    product.categories = createProductDto.category_id;
    console.log('PRODUCT:', product)

    const result = await this.productsRepository.save(product);
    console.log('RESULT:', result)

    return result;
  }

  findAll() {
    return this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id: id },
    });
    if (!product) {
      throw new NotFoundException(`Le produit avec l'ID ${id} n'existe pas.`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    let product = await this.findOne(id);

    const updatedProduct = this.productsRepository.merge(product, updateProductDto);
    const result = await this.productsRepository.save(updatedProduct);
    return result;
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    const response = await this.productsRepository.remove(product);
    return response;
  }
}
