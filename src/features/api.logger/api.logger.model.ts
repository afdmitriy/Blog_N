import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema()
export class ApiLog {

	_id: Types.ObjectId;

	@Prop({ required: true })
	ip: string;

   @Prop({ required: true })
	url: string;

	@Prop({ required: true})
	createdAt: string; 
}

export type apiLogDocument = HydratedDocument<ApiLog>;
export const apiLogSchema = SchemaFactory.createForClass(ApiLog); 

export interface ApiLogInputModel {
   ip: string;
   url: string;
   createdAt: string;
}