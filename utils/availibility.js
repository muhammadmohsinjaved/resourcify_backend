const isWithinAvailability = (
  requestedStart,
  requestedEnd,
  availabilityStart,
  availabilityEnd
) => {
  const [availabilityStartHour, availabilityStartMinute] = availabilityStart
    .split(":")
    .map(Number);
  const [availabilityEndHour, availabilityEndMinute] = availabilityEnd
    .split(":")
    .map(Number);

  const requestedStartTime = new Date(requestedStart);
  const requestedEndTime = new Date(requestedEnd);

  const availabilityStartTime = new Date(requestedStartTime);
  availabilityStartTime.setHours(
    availabilityStartHour,
    availabilityStartMinute,
    0,
    0
  );

  const availabilityEndTime = new Date(requestedStartTime);
  availabilityEndTime.setHours(
    availabilityEndHour,
    availabilityEndMinute,
    0,
    0
  );

  return (
    requestedStartTime >= availabilityStartTime &&
    requestedEndTime <= availabilityEndTime
  );
};

export default isWithinAvailability;
