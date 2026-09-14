import { Module } from '@nestjs/common';
import { UniversityModule } from './university/university.module';
import { InteractionModule } from './interaction/interaction.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';


@Module({
  imports: [UniversityModule, InteractionModule, UsersModule, RolesModule,],
  controllers: [ ],
  providers: [ ],
})
export class AppModule {}
