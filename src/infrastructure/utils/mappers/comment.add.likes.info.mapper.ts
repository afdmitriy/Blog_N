// import { PaginationWithItems } from "../../../base/models/pagination";
// import { CommentOutputModel } from "../../../features/comments/api/models/output/comment.output.model";


// export const commentAddLikesInfoMapper = async (
//    comments: PaginationWithItems<CommentOutputModel>, userId?: string
// ): Promise<PaginationWithItems<CommentOutputModel>> => {
   
//    const itemsWithLikes = comments.items.map(item =>
//       CommentService.makeLikesInfo(item.id, userId).then(likesInfo => ({
//          ...item,
//          likesInfo
//       }))
//    );

//    // Ожидаем завершения всех промисов
//    const items = await Promise.all(itemsWithLikes);

//    return {
//       pagesCount: comments.pagesCount,
//       page: comments.page,
//       pageSize: comments.pageSize,
//       totalCount: comments.totalCount,
//       items
//    };

// };