import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';
import { RolesRepository } from './repositories/roles.repository';
import { RoleEntity } from '@entities/role.entity';
import { PermissionsModule } from '@modules/permissions/permissions.module';
import { PermissionEntity } from '@entities/permission.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([RoleEntity, PermissionEntity]),
        PermissionsModule,
    ],
    controllers: [RolesController],
    providers: [RolesRepository, RolesService],
    exports: [RolesService, RolesRepository],
})
export class RolesModule { }
