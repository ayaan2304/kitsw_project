export const formatBytes = (size: number) => {
  if (!size) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const order = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / Math.pow(1024, order);
  return `${value.toFixed(order === 0 ? 0 : 1)} ${units[order]}`;
};

export const titleCaseFromSlug = (slug: string) => {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const semesterLabel = (semester: string) => {
  const semNumber = Number(semester);
  const suffix =
    semNumber === 1
      ? 'st'
      : semNumber === 2
      ? 'nd'
      : semNumber === 3
      ? 'rd'
      : 'th';
  return `${semNumber}${suffix} Semester`;
};

export const yearFromSemester = (semester: string) => {
  const semNumber = Number(semester);
  if (semNumber <= 2) return '1st Year';
  if (semNumber <= 4) return '2nd Year';
  if (semNumber <= 6) return '3rd Year';
  return '4th Year';
};

