// 第一版：遍历判断
function tranformStr(str) {
  if (str.length <= 1) {
    return str;
  }
  const len = str.length;
  let newStr = "";
  let current = "";
  let currentCount = 0;
  for (let i = 0; i < len; i++) {
    if (str[i] !== current) {
      currentCount > 1 && (newStr += currentCount); // 确定重复值的个数
      currentCount = 1; // 重置
      current = str[i];
      newStr += current;
    } else {
      currentCount++;
      // 遍历结束
      if (i === len - 1) {
        currentCount > 1 && (newStr += currentCount);
      }
    }
  }
  return newStr;
}
// 第二版;转化成数组
function tranformStr(str) {
  if (str.length <= 1) {
    return str;
  }
  const arr = str.split("");
  let curCount = 0;
  const newStr = arr.reduce((acc, cur, index, array) => {
    if (acc[acc.length - 1] !== cur) {
      curCount > 1 && (acc += curCount);
      curCount = 1;
      acc += cur;
    } else {
      curCount++;
      if (index === array.length - 1) {
        curCount > 1 && (acc += curCount);
      }
    }
    return acc;
  }, str[0]);
  return newStr;
}
