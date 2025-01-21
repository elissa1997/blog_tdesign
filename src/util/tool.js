// 生成n,m以内随机数
export function random(n, m) {
  return Math.floor(Math.random() * (m - n + 1) + n);
}

// 解析markdown语法
/**
 * 
 * @param {String} 正文markdown 
 * @param {Number} 最多显示字数
 * @returns 
 */
export function parseMarkdown(str, num) {
  if (!str) {
    return '';
  } else {
    let res = str.replace(/(\*\*|__)(.*?)(\*\*|__)/g, '')          //全局匹配内粗体
      .replace(/\!\[[\s\S]*?\]\([\s\S]*?\)/g, '')                  //全局匹配图片
      .replace(/\[[\s\S]*?\]\([\s\S]*?\)/g, '')                    //全局匹配连接
      .replace(/<\/?.+?\/?>/g, '')                                 //全局匹配内html标签
      .replace(/(\*)(.*?)(\*)/g, '')                               //全局匹配内联代码块
      .replace(/`{1,2}[^`](.*?)`{1,2}/g, '')                       //全局匹配内联代码块
      .replace(/```([\s\S]*?)```[\s]*/g, '')                       //全局匹配代码块
      .replace(/\~\~(.*?)\~\~/g, '')                               //全局匹配删除线
      .replace(/[\s]*[-\*\+]+(.*)/g, '')                           //全局匹配无序列表
      .replace(/[\s]*[0-9]+\.(.*)/g, '')                           //全局匹配有序列表
      .replace(/(#+)(.*)/g, '')                                    //全局匹配标题
      .replace(/(>+)(.*)/g, '')                                    //全局匹配摘要
      .replace(/\r\n/g, "")                                        //全局匹配换行
      .replace(/\n/g, "")                                          //全局匹配换行
      .replace(/\s/g, "")                                          //全局匹配空字符;
    return res.slice(0, num);
  }
}

// 列表转树
/**
 * 
 * @param {Array}   原始数组 
 * @param {String}  id名称
 * @param {String}  父id名称 
 * @returns 
 */
export function listToTree(oldArr, idName, pidName) {
  let result = []
  let map = {}
  if (!Array.isArray(oldArr)) {//验证data是不是数组类型
      return []
  }
  oldArr.forEach(item => {//建立每个数组元素id和该对象的关系
      map[item[idName]] = item //这里可以理解为浅拷贝，共享引用
  })
  oldArr.forEach(item => {
      let parent = map[item[pidName]] //找到data中每一项item的爸爸
      if (parent) {//说明元素有爸爸，把元素放在爸爸的children下面
          (parent.children || (parent.children = [])).push(item)
      } else {//说明元素没有爸爸，是根节点，把节点push到最终结果中
          result.push(item) //item是对象的引用
      }
  })
  return result //数组里的对象和data是共享的
}

// 楼中楼评论
/**
 * 
 * @param {Array} 评论数组 
 */

export function createNestedComment(comment) {
  console.log("楼中楼评论", comment);
  let comments = comment;

  // Create a map to hold comments by their id
  const commentMap = {};
  comments.forEach(comment => {
    comment.replay = [];
    commentMap[comment.id] = comment;
  });

  // Initialize an array to hold the nested comments
  const nestedComments = [];

  // Iterate over the comments to build the nested structure
  comments.forEach(comment => {
    if (comment.parent_id !== 0) {
        // If the comment has a parent, add it to the parent's replay array
      if (commentMap[comment.parent_id]) {
        comment.repliedToUser = commentMap[comment.parent_id].user_name;
        commentMap[comment.parent_id].replay.push(comment);
      }
    } else {
      // If the comment has no parent, add it to the top-level array
      nestedComments.push(comment);
    }
  });

  nestedComments.forEach(comment => {
    comment.replay = flattenReplies(comment);
  });

  return nestedComments;
}

// 拉平二级以下评论
function flattenReplies(comment) {
  const replies = comment.replay;
  comment.replay = [];
  replies.forEach(reply => {
    comment.replay.push(reply);
    if (reply.replay.length > 0) {
      comment.replay = comment.replay.concat(flattenReplies(reply));
    }
  });
  return comment.replay;
}

// 字典翻译
/**
 * 
 * @param {Object} 字典对象 
 * @param {String} 分类对象名
 * @param {String} key值
 * 
 */
import { dict } from "@/network/static.js";

export async function translate(filename, obj, key) {
  let dictFile = undefined;
  await dict(filename).then(res => {
    dictFile = res;
  })
  console.log("字典翻译", dictFile, obj, key);
  return dictFile[obj].find(item => item.key === key)
}

// 重置对象
export function resetObj(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = undefined
    }
  }
}

// 过滤对象中空属性
export function filterObj(obj) {
  let newObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
      newObj[key] = obj[key]
    }
  }
  console.log(newObj, JSON.stringify(newObj) === '{}')
  if(JSON.stringify(newObj) === '{}'){
    return undefined;
  }else{
    return newObj;
  }
}

// 通过email获取头像
import md5 from 'md5';
export function  avatarByemail(email) {
  if (email) {
    let hash = md5(email.replace(/^\s*|\s*$/g,"").toLowerCase());
    return `https://cravatar.cn/avatar/${hash}?s=60`
  }else{
    return `https://cravatar.cn/avatar/404`
  }
}

// 处理response msg 
export function handleResponseMsg(msg) {
  // console.log("处理response msg", msg);
  if (typeof msg === 'string') {
    return msg;
  } else if (typeof msg === 'object') {
    return Object.values(msg).join('，');
  } else {
    return '未知类型的消息';
  }
}