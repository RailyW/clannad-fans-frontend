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
import AvatarBotan from '../../../assets/character-avatar/avatar-botan.png';
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
import TachieBotan from '../../../assets/character-tachie/tachie-botan.png';
import TachieYoshino from '../../../assets/character-tachie/tachie-yoshino.png';
import TachieKoumura from '../../../assets/character-tachie/tachie-koumura.png';
import TachieKappei from '../../../assets/character-tachie/tachie-kappei.png';
import TachieNaoyuki from '../../../assets/character-tachie/tachie-naouyuki.png';

// 人物数据配置
export const characters = [
  { id: 'nagisa', name: '古河 渚', avatar: AvatarNagisa, tachie: TachieNagisa, description: '本作女主角，性格温柔善良' },
  { id: 'kyou', name: '藤林 杏', avatar: AvatarKyou, tachie: TachieKyou, description: '活泼开朗的双胞胎姐姐' },
  { id: 'ryou', name: '藤林 椋', avatar: AvatarRyou, tachie: TachieRyou, description: '温柔内向的双胞胎妹妹' },
  { id: 'kotomi', name: '一之濑 琴美', avatar: AvatarKotomi, tachie: TachieKotomi, description: '天才少女，喜欢读书和小提琴' },
  { id: 'tomoyo', name: '坂上 智代', avatar: AvatarTomoyo, tachie: TachieTomoyo, description: '学生会会长，武艺高强' },
  { id: 'fuko', name: '伊吹 风子', avatar: AvatarFuko, tachie: TachieFuko, description: '喜欢海星的神秘少女' },
  { id: 'yukine', name: '宫泽 有纪宁', avatar: AvatarYukine, tachie: TachieYukine, description: '参考资料室的神秘少女' },
  { id: 'misae', name: '相乐 美佐枝', avatar: AvatarMisae, tachie: TachieMisae, description: '宿舍管理员' },
  { id: 'kouko', name: '伊吹 公子', avatar: AvatarKouko, tachie: TachieKouko, description: '主角的好友' },
  { id: 'sunohara', name: '春原 阳平', avatar: AvatarSunohara, tachie: TachieSunohara, description: '朋也的损友，搞笑担当' },
  { id: 'akio', name: '古河 秋生', avatar: AvatarAkio, tachie: TachieAkio, description: '渚的父亲，面包店老板' },
  { id: 'sanae', name: '古河 早苗', avatar: AvatarSanae, tachie: TachieSanae, description: '渚的母亲，温柔贤惠' },
  { id: 'ushio', name: '冈崎 汐', avatar: AvatarUshio, tachie: TachieUshio, description: 'After Story的关键角色' },
  { id: 'mei', name: '春原 芽衣', avatar: AvatarMei, tachie: TachieMei, description: '阳平的妹妹' },
  { id: 'botan', name: '牡丹', avatar: AvatarBotan, tachie: TachieBotan, description: '杏的宠物野猪' },
  { id: 'yoshino', name: '芳野 祐介', avatar: AvatarYoshino, tachie: TachieYoshino, description: '乐队的前成员' },
  { id: 'koumura', name: '幸村 俊夫', avatar: AvatarKoumura, tachie: TachieKoumura, description: '演剧部顾问老师' },
  { id: 'kappei', name: '柊 胜平', avatar: AvatarKappei, tachie: TachieKappei, description: '同学' },
  { id: 'naoyuki', name: '冈崎 直幸', avatar: AvatarNaoyuki, tachie: TachieNaoyuki, description: '朋也的父亲' },
];
