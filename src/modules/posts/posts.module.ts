import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '@entities/post.entity';
import { PostMetaEntity } from '@entities/post-meta.entity';
import { PostCommentEntity } from '@entities/post-comment.entity';

import { PostsController } from './controllers/posts.controller';
import { PostCommentsController } from './controllers/post-comments.controller';

import { PostsService } from './services/posts.service';
import { PostCommentsService } from './services/post-comments.service';

import { PostsRepository } from './repositories/posts.repository';

import { PostCommentsRepository } from './repositories/post-comments.repository';

import { UsersModule } from '@modules/users/users.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PostEntity,
            PostMetaEntity,
            PostCommentEntity,
        ]),
        UsersModule,
        CategoriesModule,
        AuthModule,
    ],
    controllers: [
        PostsController,
        PostCommentsController,
    ],
    providers: [
        PostsService,
        PostCommentsService,
        PostsRepository,
        PostCommentsRepository,
    ],
    exports: [
        PostsService,
        PostCommentsService,
    ],
})
export class PostsModule { }
