var cron = require('node-cron');
const MergeVideoService = require("../lib/merge-video");
const mergeVideoService = new MergeVideoService();
// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *

class ScheduleService {
    setScheduler(){
        cron.schedule('5 * * * *', function(){
            console.log('running a task every hour at 5 minutes');
            // mergeVideoService.mergeAll();
          });
    }
}
module.exports = ScheduleService;
