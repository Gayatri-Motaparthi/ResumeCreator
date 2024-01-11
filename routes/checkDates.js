function checkDates(startDate, endDate) {
  // Define an object to map month names to numerical values
  const monthMap = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
  };

  const startMonth = monthMap[startDate.month.toLowerCase()];
  const startYear = parseInt(startDate.year);

  const endMonth = monthMap[endDate.month.toLowerCase()];
  const endYear = parseInt(endDate.year);
 
  if (endYear > startYear) {
    return true;
  } else if (endYear < startYear) {
    return false;
  }

  if (endMonth > startMonth) {
    return true;
  } else if (endMonth < startMonth) {
    return false;
  }

  return false;
}

module.exports = {checkDates};
