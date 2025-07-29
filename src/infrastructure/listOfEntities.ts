import { PasswordResetData } from "../features/auth/domain/recovery.password.data.entity";
import { Blog_Orm } from "../features/blogs/domain/entities/blog.typeOrm.entity";
import { Comment_Orm } from "../features/comments/domain/comment.typeOrm.entity";
import { LikeForComment_Orm } from "../features/comments/domain/like-for-comment.typeOrm.entity";
import { LikeForPost_Orm } from "../features/posts/domain/like-for-post.typeOrm.entity";
import { Post_Orm } from "../features/posts/domain/post.typOrm.entity";
import { Answer_Orm } from "../features/quiz/domain/entities/answer.entity";
import { GameQuestion_Orm } from "../features/quiz/domain/entities/game-question.entity";
import { Game_Orm } from "../features/quiz/domain/entities/game.entity";
import { Player_Orm } from "../features/quiz/domain/entities/player.entity";
import { Question_Orm } from "../features/quiz/domain/entities/question.entity";
import { Session_Orm } from "../features/security/domain/session.typeOrm.entity";
import { User_Orm } from "../features/users/domain/user.typeOrm.entity";

export const Entities = [Question_Orm, Game_Orm, Player_Orm, User_Orm, GameQuestion_Orm, Answer_Orm, Blog_Orm, Post_Orm, Comment_Orm, LikeForComment_Orm, LikeForPost_Orm, Session_Orm, PasswordResetData]