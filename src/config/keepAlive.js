import cron from "node-cron";

const keepAlive = (url) => {
  cron.schedule("*/14 * * * *", async () => {
    try {
      await fetch(url);
      console.log("Keep-alive ping sent");
    } catch (err) {
      console.error("Keep-alive failed:", err.message);
    }
  });
};

export default keepAlive;