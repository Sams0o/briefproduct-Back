import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";
import { Category } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/user.entity";

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;

  user_id: User;

  category_id: Category;


}
