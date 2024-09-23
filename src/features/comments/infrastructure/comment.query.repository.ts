import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LikeStatusEnum } from "../../../base/models/enums/enums";
import { QueryPaginationResult } from "../../../infrastructure/types/query-sort.type";
import { PaginationWithItems } from "../../../base/models/pagination";
import { Comment_Orm } from "../domain/comment.typeOrm.entity";
import { LikeForComment_Orm } from "../domain/like-for-comment.typeOrm.entity";
import { CommentWithLikesOutputModel } from "../api/models/output/comment.output.model";

type RawCommentType = {
    comment_id: string;
    comment_content: string;
    comment_createdAt: Date;
    comment_userId: string;
    user_login: string;
    likeStatus: LikeStatusEnum | null;
    likeCount: string;
    dislikeCount: string;
  };

@Injectable()
export class CommentQueryRepository {
    constructor(@InjectRepository(Comment_Orm) protected commentRepository: Repository<Comment_Orm>,
        @InjectRepository(LikeForComment_Orm) protected commentLikeRepository: Repository<LikeForComment_Orm>) { }

    async getComments(userId?: string, sortData?: QueryPaginationResult, postId?: string, commentId?: string): Promise<PaginationWithItems<CommentWithLikesOutputModel> | CommentWithLikesOutputModel | null> {
        const baseQuery = this.commentRepository.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoinAndSelect('comment.likes', 'like')
            .select([
                'comment.id',
                'comment.content',
                'comment.createdAt',
                'comment.userId',
                'user.login',
                'SUM(CASE WHEN like.likeStatus = :like THEN 1 ELSE 0 END) AS "likeCount"',
                'SUM(CASE WHEN like.likeStatus = :dislike THEN 1 ELSE 0 END) AS "dislikeCount"',
                'MAX(CASE WHEN like.userId = :userId THEN like.likeStatus END) AS "likeStatus"',
            ])
            .setParameters({ like: 'Like', dislike: 'Dislike', userId });

        if (commentId) {
            const comment = await baseQuery
                .where('comment.id = :commentId', { commentId })
                .groupBy('comment.id, user.login') // Группируем по полям
                .getRawOne(); // Получаем один комментарий

            if (comment) {
                return this.mapCommentToResponse(comment); // Возвращаем отформатированный комментарий
            }
            return null; // Если комментарий не найден
        }

        const skip = sortData ? (sortData.pageNumber - 1) * sortData.pageSize : 0;

        const commentsQuery = baseQuery
            .where(postId ? 'comment.postId = :postId' : '1=1', { postId })
            .groupBy('comment.id, user.login')
            .orderBy(sortData?.sortBy === 'createdAt' ? 'comment.createdAt' : `comment.${sortData?.sortBy}`, sortData?.sortDirection)
            .limit(sortData?.pageSize)
            .offset(skip);



        // Получаем общее количество комментариев
        const totalCount = await commentsQuery.getCount();
        const comments = await commentsQuery
            .getRawMany(); // Получаем все комментарии
        console.log('RAW COMMENTs', comments)
        const result = comments.map(comment => this.mapCommentToResponse(comment));
        console.log('RESULT', result)
        // Формируем объект пагинации
        const paginationResult = new PaginationWithItems<CommentWithLikesOutputModel>(
            sortData ? sortData.pageNumber : 1, // Текущая страница
            sortData ? sortData.pageSize : totalCount, // Размер страницы
            totalCount, // Общее количество
            result // Комментарии
        );

        return paginationResult;
    }



    private mapCommentToResponse(rawComment: RawCommentType): CommentWithLikesOutputModel {
        console.log('Comment MAPPER', rawComment)
        return {
            id: rawComment.comment_id,
            content: rawComment.comment_content,
            createdAt: rawComment.comment_createdAt.toISOString(),
            commentatorInfo: {
                userId: rawComment.comment_userId,
                userLogin: rawComment.user_login,
            },
            likesInfo: {
                likesCount: parseInt(rawComment.likeCount, 10) || 0,
                dislikesCount: parseInt(rawComment.dislikeCount, 10) || 0,
                myStatus: rawComment.likeStatus ?? LikeStatusEnum.None,
            },
        };
    }
}