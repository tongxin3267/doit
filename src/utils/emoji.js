export const smile_array = [{
  '微笑': ':smile:',
  '脸红': ':blush:',
  '心眼': ':heart_eyes:',
  '大笑': ':grin:',
  '喜极而泣': ':joy:',
  '味道好': ':yum:',
  '墨镜': ':sunglasses:',
  '吐舌头': ':stuck_out_tongue_closed_eyes:',
  '睡觉': ':sleeping:',
  '激动': ':flushed:',
  '开心': ':relieved:',
  '失望': ':disappointed:',
  '惊讶': ':astonished:',
  '愤怒': ':rage:',
  '哭泣': ':sob:',
  '络腮胡': ':neckbeard:',
  '魔鬼': ':smiling_imp:',
  '害怕': ':fearful:',
  '流汗': ':sweat:',
  '冷汗': ':cold_sweat:',
  '尖叫': ':scream:',
},
  {
    '无嘴': ':no_mouth:',
    '无语': ':neutral_face:',
    '张嘴': ':open_mouth:',
    '鬼': ':ghost:',
    '月脸': ':new_moon_with_face:',
    '不好': ':no_good:',
    '便便': ':shit:',
    '丘比特': ':cupid:',
    '爱心': ':heart:',
    '心碎': ':broken_heart:',
    '感叹号': ':exclamation:',
    '问号': ':question:',
    '+1': ':thumbsup:',
    '-1': ':-1:',
    '胜利': ':v:',
    'OK': ':ok_hand:',
    '鼓掌': ':clap:',
    '祈祷': ':pray:',
    '雨伞': ':umbrella:',
    '太阳': ':sunny:',
    '音乐': ':musical_note:',
  },
  {
    '木槿': ':hibiscus:',
    '玫瑰': ':rose:',
    '四叶草': ':four_leaf_clover:',
    '啤酒': ':beers:',
    '鸡尾酒': ':cocktail:',
    '红酒杯': ':wine_glass:',
    '批萨': ':pizza:',
    '意面': ':spaghetti:',
    '米饭': ':rice:',
    '冰激凌': ':icecream:',
    '生日蛋糕': ':birthday:',
    '西瓜': ':watermelon:',
    '步行': ':walking:',
    '自行车': ':bike:',
    '公交车': ':bus:',
    '火车': ':train:',
    '子弹头': ':bullettrain_side:',
    '爆炸': ':boom:',
    '星星': ':star:',
    '闪电': ':zap:',
    '打针': ':syringe:',
  },
  {
    '礼物': ':gift:',
    '花束': ':bouquet:',
    '波板糖': ':lollipop:',
    '美元': ':dollar:',
    '钱袋': ':moneybag:',
    '王冠': ':crown:',
    '水晶': ':crystal_ball:',
    '礼帽': ':tophat:',
    '祝': ':congratulations:',
    '密': ':secret:',
    '吉他': ':guitar:',
    '跑步': ':running:',
    '消息泡泡': ':speech_balloon:',
    '说话': ':speak_no_evil:',
    '猴脸': ':monkey_face:',
    '天真': ':innocent:',
  }
];
export function codeToWord(code){                          //处理表情字段
  for(var i=0;i<smile_array.length;i++){
    for(var s in smile_array[i]){
      if(smile_array[i][s]==code)
        return s;
    }
  }
  return null;
}
export function  imgToCode(value){                    //评论输入内容转换（表情标签转编码）
  var emojis = value.match(/\[.*?\]/g);
  emojis = (emojis==null)?"":emojis;
  if(typeof(emojis)=="object"){
    for(var i=0;i<emojis.length;i++){
      var word = emojis[i];
      var code = wordToCode(word.substring(1,word.length-1));
      if(code!=null){
        value = value.replace(word," "+code);
      }
    }
  }
  return value;
};

function wordToCode(word){
  for(var i=0;i<smile_array.length;i++){
    for(var s in smile_array[i]){
      if(s==word){
        return smile_array[i][s];
      }
    }
  }
  return null;
};
