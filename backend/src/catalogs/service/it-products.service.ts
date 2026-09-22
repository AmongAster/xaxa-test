import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateITProductDto, UpdateITProductDto } from "../dto/create-itproduct.dto";
import { InjectModel } from "@nestjs/sequelize";
import { ITProduct } from "../models/it-product.model";

@Injectable()
export class ITProductsService {
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
