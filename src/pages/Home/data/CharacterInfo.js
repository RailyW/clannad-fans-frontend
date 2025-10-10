// 导入所有角色头像
import AvatarNagisa from '../../../assets/character-avatar/avatar-nagisa.png';
import AvatarKyou from '../../../assets/character-avatar/avatar-kyou.png';
import AvatarRyou from '../../../assets/character-avatar/avatar-ryou.png';
import AvatarKotomi from '../../../assets/character-avatar/avatar-kotomi.png';
import AvatarTomoyo from '../../../assets/character-avatar/avatar-tomoyo.png';
import AvatarFuko from '../../../assets/character-avatar/avatar-fuko.png';
import AvatarYukine from '../../../assets/character-avatar/avatar-yukine.png';
import AvatarMisae from '../../../assets/character-avatar/avatar-misae.png';
import AvatarKouko from '../../../assets/character-avatar/avatar-kouko.png';
import AvatarSunohara from '../../../assets/character-avatar/avatar-sunohara.png';
import AvatarAkio from '../../../assets/character-avatar/avatar-akio.png';
import AvatarSanae from '../../../assets/character-avatar/avatar-sanae.png';
import AvatarUshio from '../../../assets/character-avatar/avatar-ushio.png';
import AvatarMei from '../../../assets/character-avatar/avatar-mei.png';
import AvatarYoshino from '../../../assets/character-avatar/avatar-yoshino.png';
import AvatarKoumura from '../../../assets/character-avatar/avatar-koumura.png';
import AvatarKappei from '../../../assets/character-avatar/avatar-kappei.png';
import AvatarNaoyuki from '../../../assets/character-avatar/avatar-naouyuki.png';

// 导入所有角色立绘
import TachieNagisa from '../../../assets/character-tachie/tachie-nagisa.png';
import TachieKyou from '../../../assets/character-tachie/tachie-kyou.png';
import TachieRyou from '../../../assets/character-tachie/tachie-ryou.png';
import TachieKotomi from '../../../assets/character-tachie/tachie-kotomi.png';
import TachieTomoyo from '../../../assets/character-tachie/tachie-tomoyo.png';
import TachieFuko from '../../../assets/character-tachie/tachie-fuko.png';
import TachieYukine from '../../../assets/character-tachie/tachie-yukine.png';
import TachieMisae from '../../../assets/character-tachie/tachie-misae.png';
import TachieKouko from '../../../assets/character-tachie/tachie-kouko.png';
import TachieSunohara from '../../../assets/character-tachie/tachie-sunohara.png';
import TachieAkio from '../../../assets/character-tachie/tachie-akio.png';
import TachieSanae from '../../../assets/character-tachie/tachie-sanae.png';
import TachieUshio from '../../../assets/character-tachie/tachie-ushio.png';
import TachieMei from '../../../assets/character-tachie/tachie-mei.png';
import TachieYoshino from '../../../assets/character-tachie/tachie-yoshino.png';
import TachieKoumura from '../../../assets/character-tachie/tachie-koumura.png';
import TachieKappei from '../../../assets/character-tachie/tachie-kappei.png';
import TachieNaoyuki from '../../../assets/character-tachie/tachie-naouyuki.png';

// 人物数据配置
export const characters = [
  { id: 'nagisa', name: '古河 渚', avatar: AvatarNagisa, tachie: TachieNagisa, type: 'student', description: '与朋也就读于同一所学校的三年级学生。\n' +
      '在经历了长期休学后，于复学的那一天，在通往校门的长长坡道下犹豫不决时，与朋也相遇。\n' +
      '虽然在学校里有许多困难在等待着她，但她会与朋也一起努力克服。' },
  { id: 'kyou', name: '藤林 杏', avatar: AvatarKyou, tachie: TachieKyou, type: 'student', description: '朋也所在学校的三年级学生。\n' +
      '性格嘴巴毒辣、大大咧咧，但却是个很会照顾人的女孩子。\n' +
      '现在在隔壁班担任班长。\n' +
      '在二年级的时候，和朋也是同一个班级的。' },
  { id: 'kotomi', name: '一之濑 琴美', avatar: AvatarKotomi, tachie: TachieKotomi, type: 'student', description: '朋也的同级生，是年级里名列前茅的才女。\n' +
      '不过，她经常不上课，而是待在图书馆里看书。\n' +
      '有些脱离世俗感，有时说话也会显得格格不入。' },
  { id: 'tomoyo', name: '坂上 智代', avatar: AvatarTomoyo, tachie: TachieTomoyo, type: 'student', description: '今年春天转学而来的二年级女生。\n' +
      '虽然在学校里一直很好地隐藏着，但其实她的打架实力强到就算一群男生一起上也敌不过。\n' +
      '对朋也来说她是年下的学妹，但一点都不像年下。' },
  { id: 'fuko', name: '伊吹 风子', avatar: AvatarFuko, tachie: TachieFuko, type: 'student', description: '朋也所在学校的一年级学生。\n' +
      '总是一个人，手里拿着小刀静静地雕刻木片，给人一种安静文静的印象。\n' +
      '希望能把完成的雕刻作品尽可能地送给更多的人。' },
  { id: 'yukine', name: '宫泽 有纪宁', avatar: AvatarYukine, tachie: TachieYukine, type: 'student', description: '常常待在被遗忘的资料室里的二年级学生。\n' +
      '对学校和小镇的事情都很熟悉。\n' +
      '性格十分有礼貌，并称呼朋也为“前辈”。' },
  { id: 'ryou', name: '藤林 椋', avatar: AvatarRyou, tachie: TachieRyou, type: 'student', description: '和朋也同班的女生，藤林杏的双胞胎妹妹。\n' +
      '与姐姐不同，她性格消极又安静，但还是担任着班级委员长。\n' +
      '喜欢占卜，不过却从来不会准。' },
  { id: 'sunohara', name: '春原 阳平', avatar: AvatarSunohara, tachie: TachieSunohara, type: 'student', description: '朋也的损友。\n' +
      '靠体育推荐入学，但因打架被停学，结果被迫退部。\n' +
      '从那之后过着懒散的校园生活。\n' +
      '和朋也一起被称作不良搭档而出名。' },
  { id: 'misae', name: '相乐 美佐枝', avatar: AvatarMisae, tachie: TachieMisae, type: 'graduated', description: '春原所住学生宿舍的宿舍管理员。\n' +
      '性格开朗，有着大姐头的气质，是宿舍学生们信赖的好顾问。\n' +
      '听说在学生时代曾是个清秀的美少女。' },
  { id: 'akio', name: '古河 秋生', avatar: AvatarAkio, tachie: TachieAkio, type: 'resident', description: '渚的父亲。\n' +
      '和妻子早苗一起经营着一家面包店。\n' +
      '性格像是不良少年没能彻底改过就直接长大成人了一样。\n' +
      '不过，他似乎很受邻居们的喜爱。\n' +
      '一有空就会和附近的孩子们一起打棒球。' },
  { id: 'sanae', name: '古河 早苗', avatar: AvatarSanae, tachie: TachieSanae, type: 'resident', description: '渚的母亲。\n' +
      '性格和女儿渚一样孩子气，而且爱哭。\n' +
      '在帮忙经营面包店的同时，还会召集附近的小学生，给他们辅导功课。' },
  { id: 'kouko', name: '伊吹 公子', avatar: AvatarKouko, tachie: TachieKouko, type: 'resident', description: '风子的姐姐。\n' +
      '三年前还在这所学校担任美术教师。\n' +
      '能以温柔的态度对待任何人，是渚在学校里唯一敬慕的人。' },
  { id: 'koumura', name: '幸村 俊夫', avatar: AvatarKoumura, tachie: TachieKoumura, type: 'teacher', description: '在学校任教的老师，从一年级起就一直照顾朋也。\n' +
      '同时也是公子在学生时代的恩师。' },
  { id: 'mei', name: '春原 芽衣', avatar: AvatarMei, tachie: TachieMei, type: 'visitor', description: '春原的妹妹。\n' +
      '聪明伶俐、精明能干，但其实是个很关心哥哥的女孩子。\n' +
      '因为从乡下到哥哥身边来探访，对新鲜事物总是满眼好奇、充满兴奋。' },
  { id: 'yoshino', name: '芳野 祐介', avatar: AvatarYoshino, tachie: TachieYoshino, type: 'resident', description: '电工青年。\n' +
      '据说曾经以音乐为生。\n' +
      '也许是那时留下的习惯，有时会忍不住喊出摇滚的灵魂。' },
  { id: 'kappei', name: '柊 胜平', avatar: AvatarKappei, tachie: TachieKappei, type: 'resident', description: '神出鬼没的少年，常常出现在小镇的各个角落。\n' +
      '据他自己说，人生的目标就是“活得像个男子汉”。' },
  { id: 'naoyuki', name: '冈崎 直幸', avatar: AvatarNaoyuki, tachie: TachieNaoyuki, type: 'resident', description: '朋也的父亲。' },
  { id: 'ushio', name: '冈崎 汐', avatar: AvatarUshio, tachie: TachieUshio, type: 'kindergarten', description: '于After Story中登场，朋也和渚的女儿。\n' +
      '年幼天真，性格单纯可爱。\n' +
      '虽然有些爱撒娇，但在不知不觉中也展现出坚强的一面。' },
];
