import * as lodash from 'lodash';
export function groupBy(objectArray, property) {
  const results = objectArray.reduce(function (acc, obj, curIndex) {
    const key = lodash.get(obj, property, 'default');
    if (!acc[key]) {
      if (!obj?.parent) {
        acc[key] = [];
      } else {
        const parent = obj?.parent || {};
        const arrTemp = addToGroup(acc?.default, parent?.ma, obj, '');
        return { default: arrTemp };
      }
    }
    acc[key].push({ ...obj });
    return acc;
  }, {});
  return results?.default;
}
function addToGroup(arr = [], parentId = '', child = {}, preParent = '') {
  const parentSplit = parentId.split('.');
  if (parentSplit.length > 1) {
    const shifted = parentSplit.shift();
    const arrTemp = arr.find((item) => item?.ma === shifted);
    const childArr = arrTemp?.children || [];
    const results = addToGroup(childArr, parentSplit.join('.'), child, shifted);
    return arr.map((item) => {
      if (item?.ma === shifted) {
        return { ...item, children: results };
      }
      return item;
    });
  } else {
    return arr.map((item) => {
      if (`${preParent ? preParent + '.' : ''}${parentId}` === item?.ma) {
        if (!item?.children) {
          item['children'] = [];
        }
        item.children.push(child);
      }
      return item;
    });
  }
}
