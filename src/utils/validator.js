/**
 * 校验函数
 *
 * 注意：
 * 没有类型的检测
 *
 */

// 日期校验函数
const REGEX_DATETIME = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

const datetimeValidator = datetime => {
  return REGEX_DATETIME.test(datetime);
};

// 非空字符串
const notNullStringValidator = str => {
  return str != '';
};

export {
  datetimeValidator,
  notNullStringValidator
}
