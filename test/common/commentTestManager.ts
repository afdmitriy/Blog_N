
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { BlogInputModel } from '../../src/features/blogs/api/models/input/blog.input';
import { CommentOutputModel } from '../../src/features/comments/api/models/output/comment.output.model';



export class CommentTestManager {
  public adminData: {
    login: string;
    password: string;
  };
  constructor(protected readonly app: INestApplication) {
    this.adminData = {
      login: 'admin',
      password: 'qwerty',
    };
  }

  async createCommentToPost(postId: string, comment: string, token: string, status: number = 201) {
    // noinspection JSStringConcatenationToES6Template
    // eslint-disable-next-line prettier/prettier
    return request(this.app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: comment })
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

  async createNcommentsToPost(
    n: number,
    postId: string,
    token: string,
    optional: string = '',
  ): Promise<CommentOutputModel[]> {
    const basicContent = 'userCommentTestTestTest';
    const comments: CommentOutputModel[] = [];
    for (let i = 0; i < n; i++) {
      const response = await request(this.app.getHttpServer())
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: `${i}${optional}${basicContent}` })
        .expect(201);
      comments.push(response.body);
    }
    return comments;
  }
}