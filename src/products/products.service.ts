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
    try {
    const product = new Product();
    product.name = createProductDto.name;
    product.price = createProductDto.price;
    product.quantity = createProductDto.quantity;
    product.categories = createProductDto.category_id;
    console.log('PRODUCT:', product)

    const result = await this.productsRepository.save(product);
    console.log('RESULT:', result)

    return result;
    } catch (error) {
      throw new Error('La création du produit a échoué. Veuillez réessayer.');
    }
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
    try {
    let product = await this.findOne(id);

    const updatedProduct = this.productsRepository.merge(product, updateProductDto);
    const result = await this.productsRepository.save(updatedProduct);
    return result;
    } catch (error) {
      throw new Error(
        'La mise à jour du produit a échoué. Veuillez réessayer.',
      );
    }
  }

  async remove(id: number) {
    try {
    const product = await this.findOne(id);
    const response = await this.productsRepository.remove(product);
    return response;
  } catch (error) {
        throw new Error("La suppression du produit a échoué. Veuillez réessayer.");
  }
}
}
