import { Repository, EntityRepository } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {

    public async createProduct(
        createProductDto: CreateProductDTO,
    ): Promise<Product> {
        const { name, description, price } = createProductDto;
        const product = new Product();
        product.name = name;
        product.description = description;
        product.price = Number(price);
        await product.save();
        return product;
    }

    public async editProduct(
        createProductDto: CreateProductDTO,
        editedProduct: Product,
    ): Promise<Product> {
        const { name, description, price } = createProductDto;
        editedProduct.name = name;
        editedProduct.description = description;
        editedProduct.price = Number(price);
        await editedProduct.save();
        return editedProduct;
    }
}
