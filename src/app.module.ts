import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RolesModule } from './modules/roles/roles.module';
import { CartsModule } from './modules/carts/carts.module';
import { MailModule } from '@modules/mail/mail.module';

@Module({
  imports: [
    // ── Rate Limiting (OWASP: Broken Access Control / DoS) ──────────────────
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,        // 1 second
        limit: 10,        // max 10 req/s
      },
      {
        name: 'medium',
        ttl: 60_000,      // 1 minute
        limit: 100,       // max 100 req/min
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CategoriesModule,
    CoursesModule,
    LessonsModule,
    EnrollmentsModule,
    NotificationsModule,
    RolesModule,
    CartsModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    JwtAuthGuard,
  ],
})
export class AppModule { }
