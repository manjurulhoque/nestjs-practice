import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn, BaseEntity, Column, Entity, Index, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity()
@Index(['id'])
export class Product extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({ type: "int" })
    price: number;

    @OneToMany(() => ProductImage, image => image.product, { cascade: true, eager: true })
    images: ProductImage[];

    @ApiProperty({ example: '2020-08-10T05:59:36.708Z' })
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;

    @ApiProperty({ example: '2020-08-10T05:59:36.708Z' })
    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt: Date;
}
