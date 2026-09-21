import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ITProduct } from "../models/it-product.model";
import { CreateITProductDto, UpdateITProductDto } from "../dto/create-itproduct.dto";


@Injectable()
export class ITProductsService {
    constructor(
    @InjectModel(ITProduct) private productModel: typeof ITProduct){}
    
   async findAll(universityId?: number): Promise<ITProduct[]> {
    const products = await this.productModel.findAll({
        where: universityId ? { universityId } : {},
    });

    if (!products || products.length === 0) {
        throw new NotFoundException(
            universityId 
                ? `ИТ-продукты для университета #${universityId} не найдены` 
                : 'ИТ-продукты не найдены'
        );
    }

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
    return this.productModel.create(dto as ITProduct);
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
