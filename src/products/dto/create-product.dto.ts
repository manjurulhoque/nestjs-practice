import { IsString, IsNumber } from 'class-validator';

export class CreateProductDTO {

    @IsString()
    name: string

    @IsString()
    description: string

    @IsString()
    price: string

    @IsNumber()
    category_id: number
}
