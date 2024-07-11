import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PostCreateModel, PostInputModel } from '../../src/features/posts/api/models/input/post.input';
import { BlogInputModel } from '../../src/features/blogs/api/models/input/blog.input';

export class PostTestManager {
  public adminData: {
    login: string;
    password: string;
  };

  public basicPostToBlogData: {
    title: string;
    shortDescription: string;
    content: string;
  };

  constructor(protected readonly app: INestApplication) {
    this.adminData = {
      login: 'admin',
      password: 'qwerty',
    };
    this.basicPostToBlogData = {
      title: `titleTest`,
      shortDescription: `shortDescriptionTest`,
      content: `contentTest`,
    };
  }

  async createPost(postData: PostInputModel, status: number, adminData?: { login: string; password: string }) {
    // noinspection JSStringConcatenationToES6Template
    // eslint-disable-next-line prettier/prettier
    const authData = adminData ?? this.adminData
    return request(this.app.getHttpServer())
      .post(`/posts`)
      .auth(authData.login, authData.password)
      .send(postData)
      .expect(status);
  }

  async updatePost(
    postData: BlogInputModel,
    postId: string,
    status: number,
    adminData?: { login: string; password: string },
  ) {
    const authData = adminData ?? this.adminData;
    return request(this.app.getHttpServer())
      .put(`/posts/${postId}`)
      .auth(authData.login, authData.password)
      .send(postData)
      .expect(status);
  }
  async createPostToBlog(
    postData: PostCreateModel | null,
    blogId: string,
    status: number = 201,
    adminData?: { login: string; password: string },
  ) {
    const authData = adminData ?? this.adminData;
    const postCreateData = postData ?? this.basicPostToBlogData;
    return request(this.app.getHttpServer())
      .post(`/blogs/${blogId}/posts`)
      .auth(authData.login, authData.password)
      .send(postCreateData)
      .expect(status);
  }
}