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
export const getMimetype = (signature) => {
  switch (signature.toUpperCase()) {
    case '89504E47':
      return 'image/png';
    case '47494638':
      return 'image/gif';
    // case '25504446':
    //   return 'application/pdf';
    case 'FFD8FFDB':
    case 'FFD8FFE0': //JPEG IMAGE
    case 'FFD8FFE1': //Digital camera JPG using Exchangeable
    case 'FFD8FFE2': //CANNON EOS JPEG FILE
    case 'FFD8FFE8': //Still Picture Interchange File Format
      return 'image/jpeg';
    // case '504B0304':
    //   return 'application/zip';
    default:
      return null;
  }
};
