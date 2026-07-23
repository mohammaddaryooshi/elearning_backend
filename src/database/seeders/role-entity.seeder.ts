import { DataSource } from 'typeorm';
import { BaseSeeder } from './bootstrap/base.seeder';
import { RoleEntity } from '../../entities/role.entity';
import { PermissionEntity } from '../../entities/permission.entity';
import { seedRoles } from './entity-seed-data';

export class RoleEntitySeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        const roleRepository = this.dataSource.getRepository(RoleEntity);
        const permissionRepository = this.dataSource.getRepository(PermissionEntity);

        for (const row of seedRoles) {
            const permissions = row.permissions.length
                ? await permissionRepository.find({ where: row.permissions.map((name) => ({ name })) })
                : [];

            let role = await roleRepository.findOne({
                where: { name: row.name },
                relations: ['permissions'],
            });

            if (!role) {
                await roleRepository.save(roleRepository.create({
                    name: row.name,
                    description: row.description,
                    permissions,
                }));
                continue;
            }

            if (permissions.length > 0 && (!role.permissions || role.permissions.length === 0)) {
                role.permissions = permissions;
                await roleRepository.save(role);
            }
        }
    }
}
