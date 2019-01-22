export function transTime(long) {
  if (!long) return ''

  let date = new Date(long)

  let year = date.getFullYear();
  let month = lt9(date.getMonth() + 1);
  let day = lt9(date.getDate());
  let hour = lt9(date.getHours());
  let minutes = lt9(date.getMinutes());
  let second = lt9(date.getSeconds());

  return `${year}-${month}-${day} ${hour}:${minutes}:${second}`
}

function lt9(v) {
  return v > 9 ? v: ('0' + v)
}
