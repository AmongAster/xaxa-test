import { Controller } from '@nestjs/common';
import { WorkflowService } from './workflow.service';

<<<<<<< HEAD
// @Controller('workflow')
// export class WorkflowController {
//   constructor(private readonly workflowService: WorkflowService) {}
// }
 
=======
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}
}
>>>>>>> b0f5c8f0a82f3dcd5474d764deb463f61ea0ccd1
