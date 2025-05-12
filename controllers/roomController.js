import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Booking } from "../models/Booking.js";
import { Room } from "../models/Room.js";
import isWithinAvailability from "../utils/availibility.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";

export const createRoom = catchAsyncError(async (req, res, next) => {
  const { name, capacity, startTime, endTime } = req.body;
  const file = req.file;
  if (!name || !capacity || !startTime || !endTime || !file) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  let room = await Room.findOne({ name: name });

  if (room) {
    next(new ErrorHandler("Room already exists", 400));
  }

  const fileUri = getDataUri(file);

  let myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

  room = await Room.create({
    name: name,
    capacity: capacity,
    coverImage: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    availabilityHours: { start: startTime, end: endTime },
  });

  res.status(201).json({
    success: true,
    message: "Room created successfully",
  });
});

export const getAllRooms = catchAsyncError(async (req, res, next) => {
  const rooms = await Room.find({});

  res.status(200).json({
    success: true,
    rooms,
  });
});

export const getRoomById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const room = await Room.findById(id);
  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }
  res.status(200).json({
    success: true,
    room,
  });
});

export const updateRoom = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, capacity, startTime, endTime } = req.body;
  const file = req.file;
  const room = await Room.findById(id);
  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  console.log(name);

  if (name) room.name = name;
  if (capacity) room.capacity = capacity;
  if (startTime) room.availabilityHours.start = startTime;
  if (endTime) room.availabilityHours.end = endTime;

  if (file) {
    await cloudinary.v2.uploader.destroy(room.coverImage.public_id);
    const fileUri = getDataUri(file);
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
    room.coverImage.public_id = myCloud.public_id;
    room.coverImage.url = myCloud.secure_url;
  }

  await room.save();
  res.status(200).json({
    success: true,
    message: "Room updated successfully",
  });
});

export const deleteRoom = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const room = await Room.findById(id);
  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }
  await cloudinary.v2.uploader.destroy(room.coverImage.public_id);
  await room.deleteOne();
  await Booking.deleteMany({ roomId: room._id });

  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
  });
});

export const requestBooking = catchAsyncError(async (req, res, next) => {
  const { roomId, name, rollNo, email, startTime, endTime, purpose } = req.body;
  console.log(startTime, endTime);
  if (!roomId || !startTime || !endTime) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  const room = await Room.findById(roomId);
  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  const isAvailable = isWithinAvailability(startTime, endTime, room.availabilityHours.start, room.availabilityHours.end);
  console.log("Availability check:", isAvailable, startTime, endTime, room.availabilityHours);
  if (!isAvailable) {
    return next(
      new ErrorHandler(
        `Room is only available from ${room.availabilityHours.start} to ${room.availabilityHours.end}.`,
        404
      )
    );
  }

  // Check for conflicting bookings
  const conflictingBookings = await Booking.find({
    roomId,
    status: "approved",
    $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
  });

  if (conflictingBookings.length > 0) {
    return next(
      new ErrorHandler(
        "Room is not available for the requested time slot.",
        400
      )
    );
  }

  const booking = new Booking({
    roomId,
    user: req.user._id,
    name,
    rollNo,
    email,
    startTime,
    endTime,
    purpose,
  });
  await booking.save();

  res
    .status(201)
    .json({ message: "Booking request submitted successfully.", booking });
});

export const getAllBookings = catchAsyncError(async (req, res, next) => {
  const bookings = await Booking.find().populate("roomId").populate("user");
  res.status(200).json({ success: true, bookings });
});

export const changeBookingStatus = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }
  booking.status = status;
  await booking.save();
  res.status(200).json({ message: "Booking status changed successfully." });
});


export const changeAccountStatus = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }
  booking.status = status;
  await booking.save();
  res.status(200).json({ message: "Booking status changed successfully." });
});
