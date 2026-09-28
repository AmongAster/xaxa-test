import {Body,Controller,Get,Param,ParseIntPipe,Patch,Post,UseGuards,} from '@nestjs/common';
import { User } from '../users/users.model';
import {CreateWorkflowInstanceDto,TransitionWorkflowDto,} from './dto/workflow.dto';
import { WorkflowService } from './workflow.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('workflow')
@UseGuards(JwtAuthGuard)
export class WorkflowController {
  constructor(
    private readonly workflowService: WorkflowService,
  ) {}

  @Post('instances')
  async createInstance(
    @Body() dto: CreateWorkflowInstanceDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.workflowService.createInstance(
      dto,
      currentUser,
    );
  }

  @Get('instances/:id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.workflowService.findOne(
      id,
      currentUser,
    );
  }

  @Patch('instances/:id/transition')
  async transition(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TransitionWorkflowDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.workflowService.transition(
      id,
      dto,
      currentUser,
    );
  }
}