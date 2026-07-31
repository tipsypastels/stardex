window.localStorageSize = () => {
  let s = "";
  let i = 0;

  while (true) {
    const key = localStorage.key(i);
    if (!key) break;

    s += localStorage.getItem(key);
    i++;
  }

  return s ? 3 + (s.length * 16) / (8 * 1024) + " KB" : "0 KB";
};
