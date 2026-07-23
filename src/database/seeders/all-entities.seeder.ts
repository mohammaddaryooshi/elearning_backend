import { DataSource } from 'typeorm';

import { BaseSeeder } from './bootstrap/base.seeder';
import { PermissionEntitySeeder } from './permission-entity.seeder';
import { RoleEntitySeeder } from './role-entity.seeder';
import { UserEntitySeeder } from './user-entity.seeder';
import { CategoryEntitySeeder } from './category-entity.seeder';
import { PostEntitySeeder } from './post-entity.seeder';
import { PostMetaEntitySeeder } from './post-meta-entity.seeder';
import { PostViewsEntitySeeder } from './post-views-entity.seeder';
import { PostCommentEntitySeeder } from './post-comment-entity.seeder';
import { CourseCategoryEntitySeeder } from './course-category-entity.seeder';
import { CourseInstructorEntitySeeder } from './course-instructor-entity.seeder';
import { CourseEntitySeeder } from './course-entity.seeder';
import { CourseChapterEntitySeeder } from './course-chapter-entity.seeder';
import { LessonEntitySeeder } from './lesson-entity.seeder';
import { EnrollmentEntitySeeder } from './enrollment-entity.seeder';
import { CourseCommentEntitySeeder } from './course-comment-entity.seeder';
import { DiscountCodeEntitySeeder } from './discount-code-entity.seeder';
import { CartEntitySeeder } from './cart-entity.seeder';
import { CartItemEntitySeeder } from './cart-item-entity.seeder';
import { OrderEntitySeeder } from './order-entity.seeder';
import { OrderItemEntitySeeder } from './order-item-entity.seeder';
import { PaymentAttemptEntitySeeder } from './payment-attempt-entity.seeder';
import { DiscountCodeUsageEntitySeeder } from './discount-code-usage-entity.seeder';
import { NotificationEntitySeeder } from './notification-entity.seeder';
import { ContactMessageEntitySeeder } from './contact-message-entity.seeder';

const ENTITY_SEEDERS = [
    PermissionEntitySeeder,
    RoleEntitySeeder,
    UserEntitySeeder,
    CategoryEntitySeeder,
    PostEntitySeeder,
    PostMetaEntitySeeder,
    PostViewsEntitySeeder,
    PostCommentEntitySeeder,
    CourseCategoryEntitySeeder,
    CourseInstructorEntitySeeder,
    CourseEntitySeeder,
    CourseChapterEntitySeeder,
    LessonEntitySeeder,
    EnrollmentEntitySeeder,
    CourseCommentEntitySeeder,
    DiscountCodeEntitySeeder,
    CartEntitySeeder,
    CartItemEntitySeeder,
    OrderEntitySeeder,
    OrderItemEntitySeeder,
    PaymentAttemptEntitySeeder,
    DiscountCodeUsageEntitySeeder,
    NotificationEntitySeeder,
    ContactMessageEntitySeeder,
] as const;

export class AllEntitiesSeeder extends BaseSeeder {
    constructor(dataSource: DataSource) {
        super(dataSource);
    }

    async run(): Promise<void> {
        for (const SeederClass of ENTITY_SEEDERS) {
            const seeder = new SeederClass(this.dataSource);
            await seeder.run();
        }
    }
}
