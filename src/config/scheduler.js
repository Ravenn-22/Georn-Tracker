import cron from "node-cron";
import Application from "../models/Application.js";
import User from "../models/User.js";
import { sendFollowUpReminder, sendDeadlineReminder } from "./email.js";

const scheduleReminders = () => {
  // Runs every day at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    console.log("Running daily reminder check...");

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);

      // Find applications with follow-up date today
      const followUpApps = await Application.find({
        followUpDate: {
          $gte: today,
          $lt: tomorrow,
        },
      }).populate("user");

      for (const app of followUpApps) {
        if (!app.user?.email) continue;
        try {
          await sendFollowUpReminder({
            to: app.user.email,
            name: app.user.name,
            company: app.company,
            role: app.role,
            followUpDate: app.followUpDate,
          });
          console.log(`Follow-up reminder sent to ${app.user.email} for ${app.company}`);
        } catch (err) {
          console.error(`Failed to send follow-up reminder: ${err.message}`);
        }
      }

      // Find applications with deadline tomorrow
      const deadlineApps = await Application.find({
        deadline: {
          $gte: tomorrow,
          $lt: dayAfterTomorrow,
        },
      }).populate("user");

      for (const app of deadlineApps) {
        if (!app.user?.email) continue;
        try {
          await sendDeadlineReminder({
            to: app.user.email,
            name: app.user.name,
            company: app.company,
            role: app.role,
            deadline: app.deadline,
          });
          console.log(`Deadline reminder sent to ${app.user.email} for ${app.company}`);
        } catch (err) {
          console.error(`Failed to send deadline reminder: ${err.message}`);
        }
      }

    } catch (err) {
      console.error("Scheduler error:", err.message);
    }
  });

  console.log("Reminder scheduler started");
};

export default scheduleReminders;