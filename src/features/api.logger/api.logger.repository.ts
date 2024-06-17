import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ApiLog, ApiLogInputModel, apiLogDocument } from "./api.logger.model";
import { Model } from "mongoose";

Injectable()
export class ApiLogRepository {
	constructor(@InjectModel(ApiLog.name) private apiLogModel: Model<apiLogDocument>) { }

   async create(log: ApiLogInputModel): Promise<boolean> {
      const createdLog = new this.apiLogModel(log);
		const res = await createdLog.save();
      if (!res) return false
      return true
   }

}