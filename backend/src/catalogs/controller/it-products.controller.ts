import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ITProductsService } from "../service/it-products.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/roles/role.model";
import { CreateITProductDto, UpdateITProductDto } from "../dto/create-itproduct.dto";

@ApiTags('it-products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('catalogs/it-products')
export class ITProductsController {
    
    constructor(private readonly service: ITProductsService) {}

    @Get()
    findAll(@Query('universityId') universityId?: string) {
        if (universityId === undefined) {
            return this.service.findAll();
        }
        
        const parsed = Number(universityId);

        if (Number.isNaN(parsed)) {
            throw new BadRequestException('UniversityId должно быть числом');
        }
        
        return this.service.findAll(parsed);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Post()
    @Roles(RoleName.ADMIN, RoleName.MANAGER)
    create(@Body() dto: CreateITProductDto) {
        return this.service.create(dto);
    }

    @Patch(':id')
    @Roles(RoleName.ADMIN, RoleName.MANAGER)
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateITProductDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(RoleName.ADMIN, RoleName.MANAGER)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }}