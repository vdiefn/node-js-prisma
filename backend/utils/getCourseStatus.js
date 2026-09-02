export const getCourseStatus = (start, end) => {
  const now = new Date();
  const startAt = new Date(start);
  const endAt = new Date(end);
  if (now < startAt) {
    return "尚未開始";
  } else if (now >= startAt && now < endAt) {
    return "進行中";
  } else {
    return "已結束";
  }
};
