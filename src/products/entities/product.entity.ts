import { Category } from "src/categories/entities/category.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ nullable: false, unique: true })
  quantity: number;

  @ManyToOne(() => Category, (category) => category.Products)
  @JoinColumn({ name: 'category_id' })
  categories: Category;
}
