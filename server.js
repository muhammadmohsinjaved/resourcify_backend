import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
import { Room } from "./models/Room.js";
import { Booking } from "./models/Booking.js";
import cron from "node-cron";
connectDB();

await cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const completedBookings = await Booking.find({
    endTime: { $lte: now },
    status: "approved",
  });

  for (const booking of completedBookings) {
    booking.status = "completed";
    await booking.save();

    // Update room status
    const room = await Room.findById(booking.roomId);
    room.status = "available";
    await room.save();

    // Send notification to the student (you can use email, SMS, or push notifications)
    console.log(
      `Booking ${booking._id} completed. Room ${room.name} is now available.`
    );
  }
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
