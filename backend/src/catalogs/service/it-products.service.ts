import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateITProductDto, UpdateITProductDto } from "../dto/create-itproduct.dto";
import { InjectModel } from "@nestjs/sequelize";
import { ITProduct } from "../models/it-product.model";
<<<<<<< HEAD
<<<<<<< HEAD
import { CreateITProductDto, UpdateITProductDto } from "../dto/create-itproduct.dto";

@Injectable()
export class ITProductsService {
    constructor(
        @InjectModel(ITProduct) private productModel: typeof ITProduct
    ) {}
    
    async findAll(universityId?: number): Promise<ITProduct[]> {
        const products = await this.productModel.findAll({
            where: universityId ? { universityId } : {},
        });

        return products;
    }

    async findOne(id: number): Promise<ITProduct> {
        const product = await this.productModel.findByPk(id);
        if (!product) {
            throw new NotFoundException(`ИТ-продукт #${id} не найден`);
        }
        return product;
    }
 
    create(dto: CreateITProductDto): Promise<ITProduct> {
        return this.productModel.create(dto as any);
    }
 
    async update(id: number, dto: UpdateITProductDto): Promise<ITProduct> {
        const product = await this.findOne(id);
        return product.update(dto);
    }
 
    async remove(id: number): Promise<void> {
        const product = await this.findOne(id);
        await product.destroy();
    }
}
=======

@Injectable()
export class ITProductsService {
=======

@Injectable()
export class ITProductsService {
>>>>>>> b94e95c85a56af10ce762959f76bd8cef2f7c4d8
  constructor(
    @InjectModel(ITProduct) 
    private readonly productModel: typeof ITProduct,
  ) {}

   
  async findAll(universityId?: number) {
    const products = await this.productModel.findAll({
      where: universityId ? { universityId } : {},
    });

    if (products.length === 0) {
      throw new NotFoundException('ИТ-продукты не найдены');
    }

    return products;
  }

  
  async findOne(id: number) {
    const product = await this.productModel.findByPk(id);
    
    if (!product) {
      throw new NotFoundException(`ИТ-продукт #${id} не найден`);
    }
    
    return product;
  }

  async create(dto: CreateITProductDto) {
  return await this.productModel.create({ ...dto } as any); 
}

  async update(id: number, dto: UpdateITProductDto) {
    const product = await this.findOne(id);
    return await product.update(dto);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await product.destroy();
  }
}
<<<<<<< HEAD
>>>>>>> 78a8f4f968d570f6546ca46cf7d23f14d2f55029
=======
>>>>>>> b94e95c85a56af10ce762959f76bd8cef2f7c4d8
