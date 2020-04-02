export const getTimestampMultiplier = timeScale => {
  switch (timeScale) {
    case 'hour':
      return 3600000;
    case 'day':
      return 3600000 * 24;
    case 'week':
      return 3600000 * 24 * 7;
    case 'month':
      return 3600000 * 24 * 7 * 4;
  }
};
