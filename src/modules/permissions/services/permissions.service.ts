import {
    Injectable,
} from '@nestjs/common';

import { PermissionsRepository } from '@modules/permissions/repositories/permissions.repository';


@Injectable()
export class PermissionsService {
    constructor(private readonly permissionRepository: PermissionsRepository) { }

}
