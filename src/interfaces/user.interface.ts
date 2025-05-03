import { string } from "joi";

export enum PaymentMethod {
  upi = "upi",
  card = "card",
  netbanking = "netbanking",
  paypal = "paypal",
  default = "paypal"
}
export interface IPaymentDetails extends Document {
  bankName: string;
  bankAddress: string;
  accountNumber: string;
  ifscCode: string;
  custId: string;
  paymentMethod: PaymentMethod;
}
export interface IPartialHoliday extends Document {
  date: string;
  time: string[];
}
export interface IHoliday extends Document {
  date: string[];
  reason: string;
}

export interface IWorkingHours extends Document {
  0: string[];
  1: string[];
  2: string[];
  3: string[];
  4: string[];
  5: string[];
  6: string[];
}
export interface ICoverage extends Document {
  partial_working_hours: IPartialHoliday[];
  holidays: IHoliday[];
  working_hours: IWorkingHours;
  alternate_working_days: string[];
}
export interface IUser extends Document {
  id: any;
  name?: string;
  email?: string;
  clientId?: string;
  password?: string;
  profilePic?: string;
  phone_number?: string;
  dateOfBirth?: string;
  paidHolidayRemaining?: string;
  coverage?: ICoverage;
  role?: string;
  skills?: string[];
  timezone?: string;
  language?: string[];
  paymentDetails?: IPaymentDetails;
  department?: string;
}

export interface IUserUpdate extends Document {
  name?:string;
  phone_number?: string;
  password?: string;
  language?: string[];
  dateOfBirth?: string;
  gender?: string;
  
}

export interface ITime extends Document {
  date?: string;
  clock_in_time?: string;
  clock_out_time?: string;
}

export interface IRequest extends Document {
  date?: string;
  complain?: string;
}

export interface IAttendance extends Document {
  userId: string;
  clientId: string;
  status?: string;
  attendance: {
    timeCollection?: ITime[];
    request?: IRequest[];
  };
}

export interface IAttendanceUpdate extends Document {
  status?: string;
  attendance?: {
    timeCollection?: ITime;
    request?: IRequest;
  };
}

export interface IPartial extends Document {
  date?: string;
  type?: string;
  from_time?: string;
  to_time?: string;
  reason?: string;
}

export interface IFull extends Document {
  from_date?: string;
  to_date?: string;
  type?: string;
  reason?: string;
}

export interface ILeave extends Document {
  userId: string;
  clientId: string;
  leaveAvailable?: {
    casualLeave?: string;
    paidLeave?: string;
    sickLeave?: string;
  };
  leave?: {
    partialDay?: IPartial[];
    fullDay?: IFull[];
  };
}

export interface ILeaveUpdate extends Document {
  leaveAvailable?: {
    casualLeave?: string;
    paidLeave?: string;
    sickLeave?: string;
  };
  leave?: {
    partialDay?: IPartial;
    fullDay?: IFull;
  };
}
