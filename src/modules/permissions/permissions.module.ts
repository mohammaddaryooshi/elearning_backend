import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermissionsRepository } from "./repositories/permissions.repository";
import { PermissionsController } from "./controllers/permissions.controller";
import { PermissionsService } from "./services/permissions.service";
import { PermissionEntity } from "@entities/permission.entity";

// permissions/permissions.module.ts
@Module({
    imports: [TypeOrmModule.forFeature([PermissionEntity])],
    controllers: [PermissionsController],
    providers: [PermissionsService, PermissionsRepository],
    exports: [PermissionsService, PermissionsRepository],
})
export class PermissionsModule { }
