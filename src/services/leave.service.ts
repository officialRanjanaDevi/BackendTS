import { ILeave, ILeaveUpdate } from '../interfaces/user.interface';
import Leave from '../models/store.model';

export class LeaveService {
  async create(data: ILeave, language?: string) {
    const leave = new Leave(data);
    return leave.save();
  }

  async getAll(clientId:string, limit:number,page : number,language ?: string) {
    const leaves =  await Leave.find({clientId}).limit(limit)
                          .skip(page * limit)
                          .lean()
                          .exec();
    return leaves;
  }

  async getOne( clientId : string , userId : string, language ?: string ) {
    const leave = await Leave.findOne({clientId,userId}).exec();
    return leave;
  }

  async updateOne( clientId : string , userId : string, body : ILeaveUpdate, language ?: string ) {
    const leave = await Leave.findOne({clientId,userId:userId}).exec();
    if(body.leaveAvailable){
      if(body.leaveAvailable.casualLeave) leave.leaveAvailable.casualLeave = Number(leave.leaveAvailable.casualLeave) - Number(body.leaveAvailable.casualLeave);
      if(body.leaveAvailable.paidLeave) leave.leaveAvailable.paidLeave = Number(leave.leaveAvailable.paidLeave) - Number(body.leaveAvailable.paidLeave);
      if(body.leaveAvailable.sickLeave) leave.leaveAvailable.sickLeave = Number(leave.leaveAvailable.sickLeave) - Number(body.leaveAvailable.sickLeave);
    }
    if(body.leave){
      if(body.leave.partialDay) leave.leave.partialDay.push(body.leave.partialDay);
      if(body.leave.fullDay) leave.leave.fullDay.push(body.leave.fullDay);
    }
    return await Leave.updateOne(leave._id,leave);
  }

  async delete( clientId : string , userId : string , language ?: string){
    return await Leave.findByIdAndRemove({clientId,userId:userId}).exec();
  }

}
