export function getByPath(object, path) {
  if (!object || !path) return undefined;
  return path.split('.').reduce((current, key) => current?.[key], object);
}

export function matchesSearch(item, query, keys = []) {
  if (!query) return true;
  const normalized = query.toLowerCase().trim();
  return keys.some((key) => {
    const value = getByPath(item, key);
    return String(value ?? '')
      .toLowerCase()
      .includes(normalized);
  });
}

export function buildOptions(list = [], labelKey = 'name', valueKey = 'id', extraFormatter) {
  return list.map((item) => ({
    value: item[valueKey],
    label: extraFormatter ? extraFormatter(item) : item[labelKey],
  }));
}

export function groupBy(list = [], getKey) {
  return list.reduce((groups, item) => {
    const key = getKey(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}
