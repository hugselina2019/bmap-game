import bwg from '@/assets/sights-pics/bwg.jpeg'
import lfs from '@/assets/sights-pics/lfs.jpeg'
import ylh from '@/assets/sights-pics/ylh.jpeg'
import bxg from '@/assets/sights-pics/bxg.jpeg'
import dsl from '@/assets/sights-pics/dsl.jpeg'
import jf from '@/assets/sights-pics/jf.jpeg'
import sf from '@/assets/sights-pics/sf.jpeg'
import zrg from '@/assets/sights-pics/zrg.jpeg'
import hlm from '@/assets/sights-pics/hlm.jpeg'

/**
 * 示意图池：所有景点共用，按序循环平均分配
 */
const pics = [bwg, lfs, ylh, bxg, dsl, jf, sf, zrg, hlm]

/**
 * 景点数据按省份组织
 * 每条：id, name, lng, lat, province, category, desc, tip, isCheck
 * img 由 pics 池统一分配
 */
export const spotsData = {
  // ========== 河北 ==========
  hebei: [
    { id: 'hb-1', name: '廊坊市博物馆', lng: 116.7013, lat: 39.5398, province: 'hebei', category: '古建筑', desc: '廊坊市博物馆，了解廊坊本地历史文物，记录京津走廊的城市变迁。', tip: '周一闭馆，免费预约参观', isCheck: false },
    { id: 'hb-2', name: '隆福寺长明灯楼', lng: 116.6844, lat: 39.5467, province: 'hebei', category: '古迹', desc: '唐代石灯，河北省级重点文物保护单位，珍贵的唐代石刻遗存。', tip: '户外古迹，全天可参观', isCheck: false },
    { id: 'hb-3', name: '御龙河公园', lng: 116.6431, lat: 39.5221, province: 'hebei', category: '城市公园', desc: '廊坊城南滨河公园，沿河景观，适合休闲骑行打卡。', tip: '傍晚景色最佳', isCheck: false },
    { id: 'hb-4', name: '石家庄赵州桥', lng: 114.9227, lat: 37.6149, province: 'hebei', category: '古迹', desc: '世界上最早的敞肩石拱桥，始建于隋代，距今1400余年。', tip: '免费参观，桥面有步行通道', isCheck: false },
    { id: 'hb-5', name: '承德避暑山庄', lng: 117.9393, lat: 41.0128, province: 'hebei', category: '古建筑', desc: '清代皇家园林，中国四大名园之一，世界文化遗产。', tip: '旺季门票145元，建议游览一整天', isCheck: false },
    { id: 'hb-6', name: '保定直隶总督署', lng: 115.4646, lat: 38.8739, province: 'hebei', category: '古建筑', desc: '清代直隶省最高军政长官衙署，保存完整的省级衙署建筑。', tip: '门票50元，周一闭馆', isCheck: false },
    { id: 'hb-7', name: '山海关', lng: 119.7526, lat: 39.9789, province: 'hebei', category: '古迹', desc: '万里长城东端起点，天下第一关，长城与大海交汇处。', tip: '可登城楼远眺渤海', isCheck: false },
    { id: 'hb-8', name: '正定隆兴寺', lng: 114.5633, lat: 38.1410, province: 'hebei', category: '古建筑', desc: '中国十大名寺之一，寺内铜铸千手观音像高21.3米。', tip: '门票60元，大悲阁必看', isCheck: false },
    { id: 'hb-9', name: '武强年画博物馆', lng: 115.8540, lat: 37.8700, province: 'hebei', category: '非遗', desc: '中国木版年画之乡，武强木版年画国家级非遗，馆内可体验传统印刷。', tip: '可亲手印制年画带走', isCheck: false },
    { id: 'hb-10', name: '胜芳古镇老街', lng: 116.7010, lat: 39.0500, province: 'hebei', category: '特色老店', desc: '廊坊千年商贸古镇，旧时直隶四大重镇之一，老字号商铺林立。', tip: '古镇内有多家百年小吃店', isCheck: false }
  ],

  // ========== 北京 ==========
  beijing: [
    { id: 'bj-1', name: '故宫博物院', lng: 116.3972, lat: 39.9169, province: 'beijing', category: '古建筑', desc: '明清两代皇家宫殿，世界最大的古代宫殿建筑群。', tip: '周一闭馆，旺季60元', isCheck: false },
    { id: 'bj-2', name: '天坛公园', lng: 116.4107, lat: 39.8822, province: 'beijing', category: '古建筑', desc: '明清皇帝祭天祈谷之地，祈年殿为北京城市标志。', tip: '联票34元，清晨看晨练', isCheck: false },
    { id: 'bj-3', name: '颐和园', lng: 116.2755, lat: 39.9999, province: 'beijing', category: '古建筑', desc: '清代皇家园林，昆明湖万寿山构成山水画卷。', tip: '联票60元，坐船游湖更佳', isCheck: false },
    { id: 'bj-4', name: '八达岭长城', lng: 116.0191, lat: 40.3588, province: 'beijing', category: '古迹', desc: '万里长城最精华段，不到长城非好汉。', tip: '建议8号线转S2线到达', isCheck: false },
    { id: 'bj-5', name: '圆明园遗址', lng: 116.2985, lat: 40.0097, province: 'beijing', category: '古迹', desc: '万园之园遗址，大水法残柱诉说历史沧桑。', tip: '门票10元，西洋楼遗址必看', isCheck: false },
    { id: 'bj-6', name: '北海公园', lng: 116.3892, lat: 39.9246, province: 'beijing', category: '城市公园', desc: '中国现存最古老的皇家园林之一，白塔倒映碧波。', tip: '冬日湖面可滑冰', isCheck: false },
    { id: 'bj-7', name: '景山公园', lng: 116.3960, lat: 39.9183, province: 'beijing', category: '城市公园', desc: '北京城中轴制高点，登万春亭俯瞰故宫全景。', tip: '门票2元，日落时分最佳', isCheck: false },
    { id: 'bj-8', name: '什刹海', lng: 116.3837, lat: 39.9403, province: 'beijing', category: '城市公园', desc: '老北京胡同风情浓缩地，酒吧街与银锭桥看落日。', tip: '傍晚逛烟袋斜街', isCheck: false },
    { id: 'bj-9', name: '雍和宫', lng: 116.4167, lat: 39.9425, province: 'beijing', category: '古建筑', desc: '北京最大的藏传佛教寺院，清雍正帝即位前府邸。', tip: '门票25元，初一十五香火最旺', isCheck: false },
    { id: 'bj-10', name: '国子监', lng: 116.4162, lat: 39.9445, province: 'beijing', category: '古建筑', desc: '元明清三代最高学府，辟雍殿内皇帝临雍讲学。', tip: '与雍和宫相邻可同游', isCheck: false },
    { id: 'bj-11', name: '正阳门', lng: 116.3973, lat: 39.8986, province: 'beijing', category: '古建筑', desc: '前门，北京内城九门之正南门，城楼箭楼并存。', tip: '前门大街逛老字号', isCheck: false },
    { id: 'bj-12', name: '太庙', lng: 116.3912, lat: 39.9149, province: 'beijing', category: '古建筑', desc: '明清皇家祖庙，现为劳动人民文化宫。', tip: '门票2元，古柏参天', isCheck: false },
    { id: 'bj-13', name: '中山公园', lng: 116.3867, lat: 39.9098, province: 'beijing', category: '城市公园', desc: '明清太社稷坛所在地，春季赏郁金香花展。', tip: '紧邻故宫西门', isCheck: false },
    { id: 'bj-14', name: '陶然亭公园', lng: 116.3752, lat: 39.8734, province: 'beijing', category: '城市公园', desc: '南城名园，慈悲庵为李大钊等革命先驱活动地。', tip: '免费开放', isCheck: false },
    { id: 'bj-15', name: '玉渊潭公园', lng: 116.3271, lat: 39.9133, province: 'beijing', category: '城市公园', desc: '春季樱花盛开，北京最著名的赏樱胜地。', tip: '3月底至4月中赏樱', isCheck: false },
    { id: 'bj-16', name: '香山公园', lng: 116.1889, lat: 39.9933, province: 'beijing', category: '城市公园', desc: '秋季红叶漫山，京城赏秋第一去处。', tip: '10月中至11月初看红叶', isCheck: false },
    { id: 'bj-17', name: '卢沟桥', lng: 116.1935, lat: 39.8534, province: 'beijing', category: '古迹', desc: '马可波罗称世界最佳桥梁，桥上石狮数不清。', tip: '七七事变发生地', isCheck: false },
    { id: 'bj-18', name: '地坛公园', lng: 116.4174, lat: 39.9561, province: 'beijing', category: '城市公园', desc: '明清皇帝祭地之所，秋季银杏大道金黄。', tip: '11月赏银杏', isCheck: false },
    { id: 'bj-19', name: '景泰蓝艺术博物馆', lng: 116.0790, lat: 39.8740, province: 'beijing', category: '非遗', desc: '北京景泰蓝（铜胎掐丝珐琅）国家级非遗，可观摩匠人现场制作。', tip: '可体验掐丝点蓝工序', isCheck: false },
    { id: 'bj-20', name: '全聚德前门店', lng: 116.3950, lat: 39.8930, province: 'beijing', category: '特色老店', desc: '始创于1864年的中华老字号，挂炉烤鸭百年传承。', tip: '建议预约，现片现吃', isCheck: false }
  ],

  // ========== 天津 ==========
  tianjin: [
    { id: 'tj-1', name: '古文化街', lng: 117.2063, lat: 39.1444, province: 'tianjin', category: '古建筑', desc: '津门故里，泥人张彩塑、杨柳青年画汇聚地。', tip: '天后宫妈祖文化中心', isCheck: false },
    { id: 'tj-2', name: '独乐寺', lng: 117.4087, lat: 40.0391, province: 'tianjin', category: '古建筑', desc: '始建于唐，辽代重建，观音阁内11面观音像高16米。', tip: '距市区70公里，蓟州古城内', isCheck: false },
    { id: 'tj-3', name: '盘山', lng: 117.2583, lat: 40.0565, province: 'tianjin', category: '古迹', desc: '京东第一山，三盘五峰八石七十寺，乾隆帝32次登临。', tip: '秋季红叶最佳', isCheck: false },
    { id: 'tj-4', name: '天塔', lng: 117.1933, lat: 39.1036, province: 'tianjin', category: '古建筑', desc: '天津广播电视塔，415米，天塔旋云为津门十景。', tip: '观景层俯瞰水上公园', isCheck: false },
    { id: 'tj-5', name: '水上公园', lng: 117.1852, lat: 39.0758, province: 'tianjin', category: '城市公园', desc: '天津最大的综合性公园，三湖九岛柳堤花径。', tip: '免费开放', isCheck: false },
    { id: 'tj-6', name: '五大道', lng: 117.2008, lat: 39.1132, province: 'tianjin', category: '古建筑', desc: '万国建筑博览会，200余座小洋楼浓缩近代风云。', tip: '建议骑共享单车游览', isCheck: false },
    { id: 'tj-7', name: '意式风情区', lng: 117.2074, lat: 39.1315, province: 'tianjin', category: '古建筑', desc: '原意大利租界，地中海风情洋楼群，马可波罗广场。', tip: '夜晚灯光氛围好', isCheck: false },
    { id: 'tj-8', name: '大悲禅院', lng: 117.1586, lat: 39.1525, province: 'tianjin', category: '古建筑', desc: '天津最大佛寺，大雄宝殿内供奉明代铜佛。', tip: '清净礼佛，免门票', isCheck: false },
    { id: 'tj-9', name: '天津之眼', lng: 117.1949, lat: 39.1426, province: 'tianjin', category: '古建筑', desc: '世界上唯一建在桥上的摩天轮，120米高空赏海河。', tip: '夜景最佳，单次约30分钟', isCheck: false },
    { id: 'tj-10', name: '黄崖关长城', lng: 117.4130, lat: 40.0630, province: 'tianjin', category: '古迹', desc: '蓟州长城精华段，黄崖夕照为津门十景之一。', tip: '距市区120公里', isCheck: false },
    { id: 'tj-11', name: '鼓楼', lng: 117.1937, lat: 39.1385, province: 'tianjin', category: '古建筑', desc: '天津三宗宝之首，城厢中心地标。', tip: '周边商业街可逛', isCheck: false },
    { id: 'tj-12', name: '望海楼教堂', lng: 117.2044, lat: 39.1532, province: 'tianjin', category: '古建筑', desc: '天津第一座天主教堂，哥特式尖塔直插天际。', tip: '1870年天津教案发生地', isCheck: false },
    { id: 'tj-13', name: '西开教堂', lng: 117.1832, lat: 39.1228, province: 'tianjin', category: '古建筑', desc: '天津最大天主教堂，罗曼式双塔穹顶彩玻。', tip: '可入内参观', isCheck: false },
    { id: 'tj-14', name: '北宁公园', lng: 117.1863, lat: 39.1562, province: 'tianjin', category: '城市公园', desc: '宁园，古典园林风格，致远塔为标志性建筑。', tip: '免费开放', isCheck: false },
    { id: 'tj-15', name: '海河风光带', lng: 117.1902, lat: 39.1250, province: 'tianjin', category: '城市公园', desc: '海河两岸风光旖旎，夜景灯光堪比上海外滩。', tip: '推荐乘海河游船', isCheck: false },
    { id: 'tj-16', name: '庄王府', lng: 117.2012, lat: 39.1317, province: 'tianjin', category: '古建筑', desc: '原北京庄亲王府迁建天津，清代王府建筑标本。', tip: '需预约参观', isCheck: false },
    { id: 'tj-17', name: '天后宫', lng: 117.1916, lat: 39.1315, province: 'tianjin', category: '古建筑', desc: '中国三大妈祖庙之一，天津城市发源地。', tip: '每年天后诞辰有大典', isCheck: false },
    { id: 'tj-18', name: '吕祖堂', lng: 117.1814, lat: 39.1491, province: 'tianjin', category: '古建筑', desc: '义和团运动总指挥部遗址，红灯照坛口旧址。', tip: '免费参观', isCheck: false },
    { id: 'tj-19', name: '泥人张彩塑工坊', lng: 117.2100, lat: 39.1400, province: 'tianjin', category: '非遗', desc: '天津泥人张彩塑国家级非遗，百年家族技艺传承，泥塑栩栩如生。', tip: '古文化街内可参观制作过程', isCheck: false },
    { id: 'tj-20', name: '桂发祥十八街麻花', lng: 117.1900, lat: 39.1300, province: 'tianjin', category: '特色老店', desc: '百年老字号，十八街麻花什锦夹心，天津三绝之首。', tip: '总店在河西区大沽南路', isCheck: false }
  ],

  // ========== 山东 ==========
  shandong: [
    { id: 'sd-1', name: '泰山', lng: 117.1287, lat: 36.2572, province: 'shandong', category: '古迹', desc: '五岳独尊，世界文化与自然双遗产，日出云海壮观。', tip: '红门徒步约4小时登顶', isCheck: false },
    { id: 'sd-2', name: '曲阜孔庙', lng: 116.9865, lat: 35.5803, province: 'shandong', category: '古建筑', desc: '天下文庙之祖，祭祀孔子之地，大成殿气势恢宏。', tip: '三孔联票140元', isCheck: false },
    { id: 'sd-3', name: '崂山', lng: 120.4697, lat: 36.1073, province: 'shandong', category: '古迹', desc: '海上名山第一，道教发祥地，太清宫千年古刹。', tip: '南线游山看海最佳', isCheck: false },
    { id: 'sd-4', name: '趵突泉', lng: 117.0259, lat: 36.6512, province: 'shandong', category: '古迹', desc: '天下第一泉，三股泉水喷涌，济南泉水甲天下。', tip: '门票40元，雨后泉水最旺', isCheck: false },
    { id: 'sd-5', name: '大明湖', lng: 117.0238, lat: 36.6769, province: 'shandong', category: '城市公园', desc: '济南三大名胜之一，四面荷花三面柳。', tip: '免费区域逛，超然楼可登', isCheck: false },
    { id: 'sd-6', name: '千佛山', lng: 117.0254, lat: 36.6350, province: 'shandong', category: '古迹', desc: '济南三大名胜之一，隋代摩崖石刻佛像千余尊。', tip: '门票30元', isCheck: false },
    { id: 'sd-7', name: '刘公岛', lng: 122.1631, lat: 37.5079, province: 'shandong', category: '古迹', desc: '甲午战争纪念地，北洋水师提督署所在。', tip: '需乘船登岛', isCheck: false },
    { id: 'sd-8', name: '蓬莱阁', lng: 120.7538, lat: 37.8061, province: 'shandong', category: '古建筑', desc: '人间仙境，海市蜃楼奇观，八仙过海传说之地。', tip: '运气好可见海市蜃楼', isCheck: false },
    { id: 'sd-9', name: '台儿庄古城', lng: 117.5460, lat: 34.5647, province: 'shandong', category: '古建筑', desc: '京杭运河水乡古城，抗战大捷纪念地。', tip: '夜景灯光绝佳', isCheck: false },
    { id: 'sd-10', name: '青岛栈桥', lng: 120.3145, lat: 36.0589, province: 'shandong', category: '古建筑', desc: '青岛城市标志，回澜阁矗立海中百余年。', tip: '退潮时可赶海', isCheck: false },
    { id: 'sd-11', name: '八大关', lng: 120.3500, lat: 36.0563, province: 'shandong', category: '古建筑', desc: '万国建筑博览会，20余国风格别墅掩映花木间。', tip: '秋看红叶春赏樱花', isCheck: false },
    { id: 'sd-12', name: '灵岩寺', lng: 116.9782, lat: 36.3741, province: 'shandong', category: '古建筑', desc: '中国四大名刹之一，辟支塔与彩塑罗汉像名冠海内。', tip: '门票45元', isCheck: false },
    { id: 'sd-13', name: '五四广场', lng: 120.3831, lat: 36.0618, province: 'shandong', category: '城市公园', desc: '青岛城市客厅，五月的风雕塑红色旋风升腾。', tip: '夜景灯光秀', isCheck: false },
    { id: 'sd-14', name: '微山湖', lng: 117.1280, lat: 34.7060, province: 'shandong', category: '城市公园', desc: '铁道游击队故乡，北方最大淡水湖，荷花万亩。', tip: '夏季赏荷7-8月最佳', isCheck: false },
    { id: 'sd-15', name: '水泊梁山', lng: 116.5860, lat: 35.7410, province: 'shandong', category: '古迹', desc: '一百单八将聚义地，忠义堂与断金亭。', tip: '水浒文化沉浸体验', isCheck: false },
    { id: 'sd-16', name: '孟庙', lng: 116.9771, lat: 35.3738, province: 'shandong', category: '古建筑', desc: '亚圣孟子祭祀庙宇，与孔庙同在邹城。', tip: '可与孔庙同日游览', isCheck: false },
    { id: 'sd-17', name: '岱庙', lng: 117.1320, lat: 36.1830, province: 'shandong', category: '古建筑', desc: '泰山脚下东岳大帝行宫，历代帝王封禅驻跸之所。', tip: '登泰山前先逛岱庙', isCheck: false },
    { id: 'sd-18', name: '长岛', lng: 120.7380, lat: 37.9320, province: 'shandong', category: '古迹', desc: '海上仙山，黄渤海交汇处，月牙湾球石沙滩。', tip: '需从蓬莱乘船', isCheck: false },
    { id: 'sd-19', name: '杨家埠木版年画', lng: 119.2100, lat: 36.4100, province: 'shandong', category: '非遗', desc: '潍坊杨家埠木版年画国家级非遗，中国三大年画产地之一，可现场印制。', tip: '春节前年画作坊最热闹', isCheck: false },
    { id: 'sd-20', name: '周村烧饼博物馆', lng: 117.8700, lat: 36.8000, province: 'shandong', category: '特色老店', desc: '淄博周村百年老字号，薄酥脆烧饼传承百年的手工技艺。', tip: '可观看制作并品尝刚出炉的', isCheck: false }
  ],

  // ========== 浙江 ==========
  zhejiang: [
    { id: 'zj-1', name: '西湖', lng: 120.1487, lat: 30.2413, province: 'zhejiang', category: '城市公园', desc: '淡妆浓抹总相宜，世界文化遗产，中国人文湖泊之魂。', tip: '环湖骑行或坐游船', isCheck: false },
    { id: 'zj-2', name: '灵隐寺', lng: 120.1061, lat: 30.2413, province: 'zhejiang', category: '古建筑', desc: '江南古刹之首，飞来峰石窟造像，济公活佛道场。', tip: '飞来峰石刻必看', isCheck: false },
    { id: 'zj-3', name: '六和塔', lng: 120.1226, lat: 30.2086, province: 'zhejiang', category: '古建筑', desc: '钱塘江畔千年古塔，登塔观钱塘潮涌。', tip: '中秋前后可观潮', isCheck: false },
    { id: 'zj-4', name: '雷峰塔', lng: 120.1494, lat: 30.2293, province: 'zhejiang', category: '古建筑', desc: '白蛇传传说地，夕照雷峰为西湖十景之一。', tip: '傍晚登塔看日落', isCheck: false },
    { id: 'zj-5', name: '岳王庙', lng: 120.1452, lat: 30.2513, province: 'zhejiang', category: '古建筑', desc: '纪念民族英雄岳飞，精忠报国浩气长存。', tip: '门票25元', isCheck: false },
    { id: 'zj-6', name: '河坊街', lng: 120.1820, lat: 30.2469, province: 'zhejiang', category: '古建筑', desc: '杭州历史文化街区，胡庆余堂与百年老铺云集。', tip: '品尝定胜糕与龙须糖', isCheck: false },
    { id: 'zj-7', name: '西溪湿地', lng: 120.0636, lat: 30.2648, province: 'zhejiang', category: '城市公园', desc: '城市中的湿地公园，摇橹船穿行芦苇荡。', tip: '乘摇橹船慢游最佳', isCheck: false },
    { id: 'zj-8', name: '千岛湖', lng: 119.0322, lat: 29.5990, province: 'zhejiang', category: '城市公园', desc: '天下第一秀水，1078个翠岛散落碧波。', tip: '中心湖区游船约4小时', isCheck: false },
    { id: 'zj-9', name: '乌镇', lng: 120.4817, lat: 30.7412, province: 'zhejiang', category: '古建筑', desc: '中国最后的枕水人家，小桥流水白墙黛瓦。', tip: '夜宿西栅看灯火', isCheck: false },
    { id: 'zj-10', name: '南浔古镇', lng: 120.4195, lat: 30.8748, province: 'zhejiang', category: '古建筑', desc: '江南六大古镇之首，中西合璧的百间楼。', tip: '比乌镇更清净', isCheck: false },
    { id: 'zj-11', name: '普陀山', lng: 122.3960, lat: 30.0086, province: 'zhejiang', category: '古迹', desc: '海天佛国，观音菩萨道场，海天一色梵音缭绕。', tip: '需从舟山乘船上岛', isCheck: false },
    { id: 'zj-12', name: '雁荡山', lng: 121.1270, lat: 28.6430, province: 'zhejiang', category: '古迹', desc: '东南第一山，灵峰夜景剪影如画。', tip: '灵峰夜景18:30后开放', isCheck: false },
    { id: 'zj-13', name: '天一阁', lng: 121.5437, lat: 29.8720, province: 'zhejiang', category: '古建筑', desc: '中国现存最古老的私家藏书楼，四百年风雨书香。', tip: '门票30元', isCheck: false },
    { id: 'zj-14', name: '绍兴古城', lng: 120.5800, lat: 30.0000, province: 'zhejiang', category: '古建筑', desc: '鲁迅故里，乌篷船摇橹穿行古街水巷。', tip: '品黄酒逛百草园', isCheck: false },
    { id: 'zj-15', name: '良渚古城遗址', lng: 120.0573, lat: 30.3697, province: 'zhejiang', category: '古迹', desc: '五千年中华文明实证地，世界文化遗产。', tip: '遗址公园需预约', isCheck: false },
    { id: 'zj-16', name: '钱塘江', lng: 120.1800, lat: 30.2700, province: 'zhejiang', category: '古迹', desc: '八月十八潮壮观天下无，钱塘涌潮天下奇观。', tip: '农历八月十八观潮节', isCheck: false },
    { id: 'zj-17', name: '宋城', lng: 120.0829, lat: 30.1817, province: 'zhejiang', category: '古建筑', desc: '给我一天还你千年，宋城千古情演出震撼。', tip: '千古情演出票含景区', isCheck: false },
    { id: 'zj-18', name: '九溪烟树', lng: 120.1090, lat: 30.1950, province: 'zhejiang', category: '城市公园', desc: '西湖西畔十八弯，溪水潺潺林木幽深。', tip: '夏日避暑胜地', isCheck: false },
    { id: 'zj-19', name: '龙井茶非遗体验馆', lng: 120.1270, lat: 30.2217, province: 'zhejiang', category: '非遗', desc: '西湖龙井炒制技艺国家级非遗，可观摩非遗传承人手工炒茶。', tip: '清明前可体验采茶炒茶', isCheck: false },
    { id: 'zj-20', name: '胡庆余堂老店', lng: 120.1820, lat: 30.2469, province: 'zhejiang', category: '特色老店', desc: '始创于1874年的中药老字号，胡雪岩创办，江南药王百年传承。', tip: '河坊街内，可参观中药博物馆', isCheck: false }
  ]
}

// 图片统一平均分配：90 条数据 / 9 张图 = 每张恰好 10 次
let picIndex = 0
for (const list of Object.values(spotsData)) {
  list.forEach(spot => {
    spot.img = pics[picIndex++ % pics.length]
  })
}

/**
 * 获取所有省的景点汇总列表（向后兼容）
 */
export const spotList = Object.values(spotsData).flat()
