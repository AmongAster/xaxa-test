import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { UniversitiesService } from "../service/universities.service";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { User } from "src/users/users.model";
import { FilterUniversityDto } from "../dto/filter-university.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { RoleName } from "src/roles/role.model";
import { CreateUniversityDto } from "../dto/create-university.dto";
import { UpdateUniversityDto } from "../dto/update-university.dto";



@ApiTags('Universities')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('catalogs/Universities')
export class UniversitiesController {

    constructor(private readonly service: UniversitiesService){}

    @Get()
    findAll(@CurrentUser() user: User, @Query() filter: FilterUniversityDto){
      return this.service.findAll(user, filter);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
        return this.service.findOne(id, user)
    }

    @Post()
    @Roles(RoleName.ADMIN, RoleName.MANAGER)
    create(@Body() dto: CreateUniversityDto){
        return this.service.create(dto);
    }

    @Patch(':id')
    @Roles(RoleName.ADMIN, RoleName.MANAGER)
    update(@Param('id', ParseIntPipe) id: number, 
    @Body() dto: UpdateUniversityDto,
    @CurrentUser() user: User, ){
        return this.service.update(id, dto, user);
    }

    @Delete(':id')
    @Roles(RoleName.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User, ) {
    return this.service.remove(id, user)
    }
}