import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './features/users/api/users.controller';
import { BlogController } from './features/blogs/api/blog.controller';
import { PostController } from './features/posts/api/post.controller';
import { UserService } from './features/users/application/user.service';
import { BlogService } from './features/blogs/application/blog.service';
import { PostService } from './features/posts/application/post.service';
import { UserSchema } from './features/users/domain/user.mongoose.entity';
import { PostSchema } from './features/posts/domain/post.mongoose.entity';
import { BlogSchema } from './features/blogs/domain/entities/blog.mongoose.entity';
import { TestingController } from './features/testing/testing.controller';
import { UserRepository } from './features/users/infrastructure/user.repository';
import { UserQueryRepository } from './features/users/infrastructure/user.query.repository';
import { BlogRepository } from './features/blogs/infrastructure/blog.repository';
import { BlogQueryRepository } from './features/blogs/infrastructure/blog.query.repository';
import { PostRepository } from './features/posts/infrastructure/post.repository';
import { PostQueryRepository } from './features/posts/infrastructure/post.query.repository';
import { LikePostRepository } from './features/posts/infrastructure/like.post.repository';
import { LikePostSchema } from './features/posts/domain/like.for.post.mongoose.entity';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017', {dbName: 'blog-nest'}),
  MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, 
    { name: 'Blog', schema: BlogSchema },
    {name: 'Post', schema: PostSchema},
    {name: 'LikeForPost', schema: LikePostSchema}
  ])
  ],
  controllers: [UserController, BlogController, PostController, TestingController],
  providers: [UserService, BlogService, PostService, UserRepository, UserQueryRepository, BlogRepository, BlogQueryRepository,
    PostRepository, PostQueryRepository, LikePostRepository
  ],
})
export class AppModule {}
