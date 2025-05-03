// import { logger } from "./../config/logger.config";

export class FormatMessage {

  static getIstTime(time: any) {
    console.debug({ time });
    try {
      // const parsedDate = parseInt(time);
      var dateUTC = new Date(time);
      // var dateUTC = dateUTC.getTime();
      var dateIST = new Date(dateUTC);
      //date shifting for IST timezone (+5 hours and 30 minutes)
      dateIST.setHours(dateIST.getHours() + 5);
      dateIST.setMinutes(dateIST.getMinutes() + 30);
      let timestamp = new Date(time ? dateIST : Date.now()).toLocaleString("en-IN");
      timestamp = timestamp.replace(",", " ");

      const split = timestamp.split("/");
      const data = [split[1], split[0], split[2]].join("/");
      console.debug(data);
      return data;
    } catch (err) {
      console.error(err);
    }
  }
}
