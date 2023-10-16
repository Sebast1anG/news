export const filterBySource = (source) => ({
  type: 'FILTER_BY_SOURCE',
  source,
});

export const filterByDate = (year, month) => ({
  type: 'FILTER_BY_DATE',
  year,
  month,
});