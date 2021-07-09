import { Controller, Get, HttpException, HttpStatus, Delete, Param, Patch, Body, ValidationPipe, Post, UseGuards, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from './product.entity';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { ReturnUser } from 'src/auth/dto/index.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator";
import { productImagesConfig } from "./product-images.config";
import { ProductImageService } from './product-image.service';
import { CreateProductImageDTO } from './dto/create-product-image.dto';
import { AdminGuard } from 'src/auth/guards/roles.guard';

@Controller('products')
@ApiTags('products')
export class ProductController {

    constructor(private productService: ProductService, private productImageService: ProductImageService) { }

    @Post('')
    @UseGuards(AuthGuard(), AdminGuard)
    @UseInterceptors(FilesInterceptor('images', 20, productImagesConfig))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'images', required: true })
    @ApiBadRequestResponse()
    public async create(@UploadedFiles() images, @Body(ValidationPipe) createProductDto: CreateProductDTO): Promise<Product> {
        const newProduct = await this.productService.createProduct(createProductDto);
        for (const image of images) {
            const productImageDto = new CreateProductImageDTO();
            productImageDto.image_url = image.path;
            productImageDto.product_id = newProduct.id;
            const productImage = await this.productImageService.createProductImage(productImageDto);
        };
        return newProduct;
    }

    @Get('')
    public async getAll(@GetUser() user: ReturnUser): Promise<Product[]> {
        const products = await this.productService.getProducts();
        return products;
    }

    @Patch('/edit/:id')
    @UseGuards(AuthGuard())
    @UseInterceptors(FilesInterceptor('images', 20, productImagesConfig))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'images', required: false })
    @ApiBadRequestResponse()
    public async edit(
        @Body(ValidationPipe) createProductDto: CreateProductDTO,
        @Param('id') id: number,
    ): Promise<Product> {
        const product = await this.productService.editProduct(
            id,
            createProductDto,
        );
        return product;
    }

    @Delete('/delete/:id')
    @UseGuards(AuthGuard())
    public async deleteById(@Param('id') productId: number) {
        const deleted = await this.productService.deleteProduct(productId);
        return deleted;
    }

    @Get('/:productId')
    public async getProduct(@Param('productId') id: number) {
        const product = await this.productService.getProduct(id);
        return product;
    }
}

