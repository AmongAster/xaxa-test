import { ApiTags } from "@nestjs/swagger";
import { ITDirectionsService } from "../service/it-directions.service";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role, RoleName } from "../../roles/role.model";
import { CreateITDirectionDto, UpdateITDirectionDto } from "../dto/create-itdirection.dto";



@ApiTags('it-directions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('catalogs/it-directions')
export class ITDirectionController {
    constructor(private readonly service: ITDirectionsService){}
    
    @Get()
    findAll(){
        return this.service.findAll(); 
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

     
    @Post()
    @Roles(RoleName.ADMIN, RoleName.MANAGER)
    create(@Body() dto: CreateITDirectionDto){
        return this.service.create(dto);
    }

    @Patch(':id')
    @Roles(RoleName.ADMIN, RoleName.MANAGER)
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateITDirectionDto){
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(RoleName.ADMIN, RoleName.MANAGER)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }}