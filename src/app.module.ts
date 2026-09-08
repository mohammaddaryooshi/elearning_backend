import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CoursesModule } from './modules/courses/courses.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RolesModule } from './modules/roles/roles.module';
import { CartsModule } from './modules/carts/carts.module';
import { MailModule } from '@modules/mail/mail.module';
import { SmsModule } from '@modules/sms/sms.module';
import { PermissionsModule } from '@modules/permissions/permissions.module';
import { ApiSuccessInterceptor } from './common/interceptors/api-success.interceptor';
import { CourseCategoriesModule } from '@modules/courses/course-categories.module';
import { TicketsModule } from '@modules/tickets/tickets.module';

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
    RolesModule,
    PermissionsModule,
    UsersModule,
    TicketsModule,
    CategoriesModule,
    PostsModule,
    CourseCategoriesModule,
    CoursesModule,
    CartsModule,
    NotificationsModule,
    MailModule,
    SmsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiSuccessInterceptor,
    },
    JwtAuthGuard,
  ],
})
export class AppModule { }
