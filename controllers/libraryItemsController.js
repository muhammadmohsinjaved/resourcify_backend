import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { LendItemRequest } from "../models/LendItemRequest.js";
import { LibraryItem } from "../models/LibraryItem.js";
import { User } from "../models/User.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import { v2 } from "cloudinary";

export const createLibraryItem = catchAsyncError(async (req, res, next) => {
  const file = req.file;
  const {
    title,
    subtitle,
    type,
    author,
    edition,
    location,
    isbn,
    publisherCode,
    copyright,
  } = req.body;

  if (
    !title ||
    !subtitle ||
    !type ||
    !author ||
    !location ||
    !isbn ||
    !publisherCode ||
    !copyright ||
    !file
  ) {
    return next(new ErrorHandler("Please enter all fields", 401));
  }
  const fileUri = getDataUri(file);
  const mycloud = await v2.uploader.upload(fileUri.content);

  await LibraryItem.create({
    title: title,
    subtitle: subtitle,
    type: type,
    author: author,
    edition: edition,
    location: location,
    isbn: isbn,
    publisherCode: publisherCode,
    copyright: copyright,
    file: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
    createdBy: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Library Item Created Successfully",
  });
});

export const getAllLibraryItems = catchAsyncError(async (req, res, next) => {
  const libraryItems = await LibraryItem.find({});

  res.status(200).json({
    success: true,
    libraryItems,
  });
});

export const updateLibraryItem = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, subtitle, type, author, edition } = req.body;

  if (!id) return next(new ErrorHandler("Item ID is required", 400));

  const selectedLibraryItem = await LibraryItem.findById(id);
  if (!selectedLibraryItem) {
    return next(new ErrorHandler("Item not found", 404));
  }

  if (title) selectedLibraryItem.title = title;
  if (subtitle) selectedLibraryItem.subtitle = subtitle;
  if (type) selectedLibraryItem.type = type;
  if (author) selectedLibraryItem.author = author;
  if (edition) selectedLibraryItem.edition = edition;

  if (req.file) {
    try {
      await v2.uploader.destroy(selectedLibraryItem.file.public_id);

      const fileUri = getDataUri(req.file);
      const mycloud = await v2.uploader.upload(fileUri.content);

      selectedLibraryItem.file = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      };
    } catch (err) {
      return next(new ErrorHandler("File upload failed", 500));
    }
  }

  await selectedLibraryItem.save();

  res.status(200).json({
    success: true,
    message: "Library Item updated successfully",
  });
});

export const deleteLibraryItem = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const selectedLibraryItem = await LibraryItem.findById(id);

  if (!selectedLibraryItem) {
    return next(new ErrorHandler("Invalid Item Id", 400));
  }

  await v2.uploader.destroy(selectedLibraryItem.file.public_id);
  await selectedLibraryItem.deleteOne();

  res.status(200).json({
    success: true,
    message: "Library Item Deleted Successfully",
  });
});

export const lendLibraryItem = catchAsyncError(async (req, res, next) => {
  const { item, name, regNo, department, email, phone, startDate, endDate } =
    req.body;

  if (
    !item ||
    !startDate ||
    !endDate ||
    !name ||
    !phone ||
    !email ||
    !department
  ) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const borrower = await User.findById(req.user._id);

  if (!borrower) {
    return next(new ErrorHandler("Borrower not found", 404));
  }

  let request = await LendItemRequest.create({
    borrower: borrower._id,
    item: item,
    name: name,
    regNo: regNo,
    department: department,
    email: email,
    phone: phone,
    startDate: startDate,
    endDate: endDate,
  });

  res.status(200).json({
    success: true,
    message: "Library Item Lent Request Generated Successfully",
  });
});

export const changeLendItemRequestStatus = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const item = await LendItemRequest.findById(id);

    if (!item) {
      return next(new ErrorHandler("Invalid Request Id", 400));
    }

    item.status = status;
    await item.save();

    res.status(200).json({
      success: true,
      message: "Lend Item Request Approved Successfully",
    });
  }
);

export const getAllLendItemsRequest = catchAsyncError(
  async (req, res, next) => {
    const items = await LendItemRequest.find()
      .populate("borrower")
      .populate("item");
    res.status(200).json({
      success: true,
      items,
    });
  }
);
