import { Length } from "class-validator";
import { Trim } from "../../../../../infrastructure/decorators/transform/trim.decorator";

export interface CommentCreateModel {
   content: string;
   userId: string;
   postId: string;
}

export class CommentUpdateInputModel {
   @Trim()
   @Length(20, 300)
   content: string;
}