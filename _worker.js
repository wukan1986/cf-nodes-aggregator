// 注意：为防代码被拦截，链接vless被替换成了${atob('dmxlc3M=')}

// CF节点信息，只替换hostname和port就可以实现优选
let CF_NODES = `
# https://xxx.eu.cc/sub?token=1e0294bba5c6960fe5f5e600f0a883c9
${atob('dmxlc3M=')}://00000000-0000-4000-8000-000000000000@malaysia.com:443?security=tls&type=ws&host=xxx.eu.cc&fp=chrome&sni=xxx.eu.cc&encryption=none&ech=cloudflare-ech.com%2Bhttps%3A%2F%2F223.5.5.5%2Fdns-query&path=%2Fproxyip%3Dproxyip.cmliussss.net%3Fech%3D1#0000|%E9%A9%AC%E6%9D%A5%E8%A5%BF%E4%BA%9AMalaysia
# https://xxx.xxxx.de5.net/sub?token=1d5638ceae20667ab8ddef752cae99bf
${atob('dmxlc3M=')}://11111111-1111-4111-8111-111111111111@ct.090227.xyz:80?security=none&type=ws&host=xxx.xxxx.de5.net&fp=chrome&sni=xxx.xxxx.de5.net&encryption=none&path=%2Fproxyip%3Dproxyip.cmliussss.net%3Fed%3D2095#1111|%E7%94%B5%E4%BF%A1090227

`;

// 自行搭建的非CF节点，无法使用优选IP域名，但可以统一放在这一起订阅管理
let NOT_CF_NODES = `
# 用#号忽略当前行
# ${atob('dmxlc3M=')}://00000000-0000-4000-8000-000000000000@127.0.01:80?security=tls&type=ws&host=xxx.eu.cc&fp=chrome&sni=xxx.eu.cc&encryption=none#备注

`;

// 订阅转换服务，由于被屏蔽，只能转换，可以通过`domain/sub`看到还原的链接
let CONVERT_URL = atob("aHR0cHM6Ly9zdWJhcGkuY21saXVzc3NzLm5ldA==");
// 配置文件模板
let CONFIG_URL = "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online.ini"


// 优选IP地址
let BEST_IP_URL = 'https://raw.githubusercontent.com/hc990275/yx/main/cfyxip.txt';

// TODO 可以在此自定义域名，其实也可以自定义IP
let BEST_DOMAINS = `cloudflare-dns.com#Cloudflare DNS
www.temu.com#Temu
docs.cloudflare.com#Cloudflare Docs
itarmy.com.ua#ItArmy乌克兰资讯科技军
www.shopify.com#Shopify
www.fbi.gov#FBI
www.wto.org#WTO
www.epicgames.com#Epic Games
support.cloudflare.com#Cloudflare Support
blog.cloudflare.com#Cloudflare Blog
ns.cloudflare.com#Cloudflare NS
developers.cloudflare.com#Cloudflare Developers
openai.com#OpenAI
www.whatismyip.net#WhatismyIP
www.npmjs.com#npmjs
cdnjs.com#cdnjs
www.udemy.com#Udemy
www.csgo.net#csgo
www.visa.cn#Visa中国
mfa.gov.ua#乌克兰外交部
store.ubi.com#Ubisoft
staticdelivery.nexusmods.com#NexusMods
icook.tw#台湾爱料理
icook.hk#香港爱料理
ip.sb#IP.sb
time.is#Time.is
www.speedtest.net#Speedtest
www.whoer.net#WHOER
japan.com#日本Japan
russia.com#俄罗斯Russia
singapore.com#新加坡Singapore
malaysia.com#马来西亚Malaysia
ln.edu.hk#香港岭南大学
biomaterials.ust.hk#香港科技大学
yingwa.edu.hk#香港英华
hongkongairport.com#香港机场
indonesia.com#印尼Indonesia
www.hugedomains.com#hugedomains
www.digitalocean.com#digitalocean
cdn.onesignal.com#onesignal
www.glassdoor.com#glassdoor
palera.in#palera
itunes.apple.com#iTunes
www.drmartens.co.kr#韩国马丁靴
skk.moe#日本前端资源
cloudflare-ech.com#CF基础设施(ECH)

saas.sin.fan#SIN域名MIYU维护
cf.tencentapp.cn#腾讯APP个人
cloudflare-dl.byoip.top#NB优选服务
cf.877774.xyz#秋名山877774
bestcf.030101.xyz#Mingyu维护030101
cf.cloudflare.182682.xyz#WeTest.Vip

cf.090227.xyz#三网090227
cm.090227.xyz#移动090227
cu.090227.xyz#联通090227
ct.090227.xyz#电信090227
cloudflare.seeck.cn#三网seeck
ctcc.cloudflare.seeck.cn#电信seeck
cmcc.cloudflare.seeck.cn#移动seeck
cucc.cloudflare.seeck.cn#联通seeck
`;

// ECH配置
const ECH_SNI = "cloudflare-ech.com";

/**
 * 地区名称映射 (全球主要 Cloudflare 节点所在国家/地区)
 */
const REGION_MAP = {
	// 亚太地区 (Asia Pacific)
	'JP': '日本', 'KR': '韩国', 'SG': '新加坡', 'HK': '香港', 'TW': '台湾',
	'MY': '马来西亚', 'TH': '泰国', 'VN': '越南', 'PH': '菲律宾', 'ID': '印尼',
	'IN': '印度', 'AU': '澳大利亚', 'NZ': '新西兰', 'KH': '柬埔寨', 'MO': '澳门',
	'BD': '孟加拉', 'PK': '巴基斯坦', 'NP': '尼泊尔', 'MN': '蒙古', 'LK': '斯里兰卡',
	'LA': '老挝', 'BN': '文莱', 'MM': '缅甸', 'BT': '不丹', 'MV': '马尔代夫',
	'AF': '阿富汗', 'TJ': '塔吉克斯坦', 'TM': '土库曼斯坦', 'TL': '东帝汶', 'FJ': '斐济',
	'PG': '巴布亚新几内亚', 'SB': '所罗门群岛', 'VU': '瓦努阿图', 'WS': '萨摩亚', 'TO': '汤加',
	'TV': '图瓦卢', 'KI': '基里巴斯', 'MH': '马绍尔群岛', 'FM': '密克罗尼西亚', 'PW': '帕劳',
	'NR': '瑙鲁', 'CK': '库克群岛', 'NU': '纽埃', 'NC': '新喀里多尼亚', 'PF': '法属波利尼西亚',
	'MP': '北马里亚纳群岛', 'AS': '美属萨摩亚', 'IO': '英属印度洋领地', 'CC': '科科斯群岛',
	'CX': '圣诞岛', 'NF': '诺福克岛', 'TK': '托克劳', 'WF': '瓦利斯和富图纳', 'PN': '皮特凯恩群岛',
	'UM': '美国本土外小岛屿',

	// 北美洲 (North America)
	'US': '美国', 'CA': '加拿大', 'MX': '墨西哥', 'PR': '波多黎各', 'GU': '关岛',
	'PM': '圣皮埃尔和密克隆', 'BM': '百慕大', 'GL': '格陵兰',

	// 欧洲 (Europe)
	'GB': '英国', 'UK': '英国', 'DE': '德国', 'FR': '法国', 'NL': '荷兰', 'IT': '意大利',
	'ES': '西班牙', 'PT': '葡萄牙', 'RU': '俄罗斯', 'UA': '乌克兰', 'PL': '波兰',
	'SE': '瑞典', 'FI': '芬兰', 'NO': '挪威', 'DK': '丹麦', 'IS': '冰岛',
	'IE': '爱尔兰', 'BE': '比利时', 'LU': '卢森堡', 'CH': '瑞士', 'AT': '奥地利',
	'CZ': '捷克', 'HU': '匈牙利', 'RO': '罗马尼亚', 'BG': '保加利亚', 'GR': '希腊',
	'TR': '土耳其', 'HR': '克罗地亚', 'RS': '塞尔维亚', 'SI': '斯洛文尼亚', 'SK': '斯洛伐克',
	'EE': '爱沙尼亚', 'LV': '拉脱维亚', 'LT': '立陶宛', 'MD': '摩尔多瓦', 'AL': '阿尔巴尼亚',
	'BA': '波黑', 'ME': '黑山', 'MK': '北马其顿', 'CY': '塞浦路斯', 'MT': '马耳他',
	'BY': '白俄罗斯', 'GE': '格鲁吉亚', 'AM': '亚美尼亚', 'AZ': '阿塞拜疆', 'LI': '列支敦士登',
	'AD': '安道尔', 'MC': '摩纳哥', 'SM': '圣马力诺', 'VA': '梵蒂冈', 'FO': '法罗群岛',
	'GI': '直布罗陀', 'IM': '马恩岛', 'JE': '泽西岛', 'GG': '根西岛', 'AX': '奥兰群岛',
	'SJ': '斯瓦尔巴和扬马延',

	// 南美洲 (South America)
	'BR': '巴西', 'AR': '阿根廷', 'CL': '智利', 'CO': '哥伦比亚', 'PE': '秘鲁',
	'EC': '厄瓜多尔', 'UY': '乌拉圭', 'PY': '巴拉圭', 'VE': '委内瑞拉', 'BO': '玻利维亚',
	'GY': '圭亚那', 'SR': '苏里南', 'FK': '福克兰群岛', 'GF': '法属圭亚那', 'GS': '南乔治亚和南桑威奇群岛',

	// 中美洲与加勒比 (Central America & Caribbean)
	'PA': '巴拿马', 'CR': '哥斯达黎加', 'GT': '危地马拉', 'HN': '洪都拉斯', 'SV': '萨尔瓦多',
	'NI': '尼加拉瓜', 'JM': '牙买加', 'DO': '多米尼加', 'BS': '巴哈马', 'TT': '特立尼达多巴哥',
	'BB': '巴巴多斯', 'CW': '库拉索', 'BZ': '伯利兹', 'DM': '多米尼克', 'GD': '格林纳达',
	'KN': '圣基茨和尼维斯', 'LC': '圣卢西亚', 'VC': '圣文森特和格林纳丁斯', 'HT': '海地',
	'CU': '古巴', 'AW': '阿鲁巴', 'BQ': '荷兰加勒比区', 'SX': '荷属圣马丁', 'MF': '法属圣马丁',
	'BL': '圣巴泰勒米', 'AI': '安圭拉', 'KY': '开曼群岛', 'TC': '特克斯和凯科斯群岛',
	'VG': '英属维尔京群岛', 'VI': '美属维尔京群岛', 'MS': '蒙特塞拉特', 'AG': '安提瓜和巴布达',

	// 中东与非洲 (Middle East & Africa)
	'ZA': '南非', 'EG': '埃及', 'MA': '摩洛哥', 'DZ': '阿尔及利亚', 'TN': '突尼斯',
	'NG': '尼日利亚', 'KE': '肯尼亚', 'GH': '加纳', 'TZ': '坦桑尼亚', 'UG': '乌干达',
	'MU': '毛里求斯', 'RE': '留尼汪', 'AO': '安哥拉', 'MZ': '莫桑比克', 'SN': '塞内加尔',
	'AE': '阿联酋', 'SA': '沙特', 'IL': '以色列', 'QA': '卡塔尔', 'BH': '巴林',
	'KW': '科威特', 'OM': '阿曼', 'JO': '约旦', 'LB': '黎巴嫩', 'IQ': '伊拉克',
	'KZ': '哈萨克斯坦', 'UZ': '乌兹别克斯坦', 'KG': '吉尔吉斯斯坦', 'SY': '叙利亚',
	'YE': '也门', 'IR': '伊朗', 'PS': '巴勒斯坦', 'MR': '毛里塔尼亚', 'ML': '马里', 'NE': '尼日尔',
	'TD': '乍得', 'SD': '苏丹', 'SS': '南苏丹', 'ER': '厄立特里亚', 'DJ': '吉布提', 'SO': '索马里',
	'ET': '埃塞俄比亚', 'CV': '佛得角', 'GW': '几内亚比绍', 'GM': '冈比亚', 'GN': '几内亚',
	'SL': '塞拉利昂', 'LR': '利比里亚', 'CI': '科特迪瓦', 'BF': '布基纳法索', 'TG': '多哥',
	'BJ': '贝宁', 'CM': '喀麦隆', 'CF': '中非', 'GQ': '赤道几内亚', 'GA': '加蓬',
	'CG': '刚果共和国', 'CD': '刚果民主共和国', 'ST': '圣多美和普林西比', 'RW': '卢旺达',
	'BI': '布隆迪', 'ZM': '赞比亚', 'MW': '马拉维', 'ZW': '津巴布韦', 'BW': '博茨瓦纳',
	'NA': '纳米比亚', 'LS': '莱索托', 'SZ': '斯威士兰', 'MG': '马达加斯加', 'KM': '科摩罗',
	'SC': '塞舌尔', 'YT': '马约特', 'SH': '圣赫勒拿', 'EH': '西撒哈拉',

	// 南极洲与其他偏远岛屿 (Antarctica & Other Islands)
	'AQ': '南极洲', 'TF': '法属南部领地', 'BV': '布韦岛', 'HM': '赫德岛和麦克唐纳群岛'
};

function withTimeoutCache(fn, options = {}) {
	const {
		maxSize = 100,
		ttl = 0,
		serialize = JSON.stringify, // 自定义序列化函数
	} = options;

	const cache = new Map();

	return async function (...args) {
		const key = serialize ? serialize(args) : JSON.stringify(args);
		const now = Date.now();

		// 检查缓存
		if (cache.has(key)) {
			const item = cache.get(key);
			// 检查过期
			if (ttl > 0 && now - item.timestamp > ttl) {
				cache.delete(key);
			} else {
				// // 更新使用顺序
				// cache.delete(key);
				// cache.set(key, {
				// 	value: item.value,
				// 	timestamp: now
				// });
				return item.value;
			}
		}

		// 计算/获取结果
		const result = await fn.apply(this, args);
		// 清理过期缓存（如果 TTL 启用）
		if (ttl > 0 && cache.size > 0) {
			cleanupSomeExpired(cache, ttl, now, 5); // 每次最多清理5个
		}
		// 如果超过最大大小，删除最久未使用的
		if (cache.size >= maxSize) {
			const oldestKey = cache.keys().next().value;
			cache.delete(oldestKey);
		}
		// 存入缓存
		cache.set(key, {
			value: result,
			timestamp: now
		});

		return result;
	};
}
function cleanupSomeExpired(cache, ttl, now, maxCount) {
	let cleaned = 0;
	for (const [key, item] of cache.entries()) {
		if (now - item.timestamp > ttl) {
			cache.delete(key);
			cleaned++;
			if (cleaned >= maxCount) break;
		}
	}
}

async function fetch_url(url) {
	console.log('fetching', url);
	const newData = await fetch(url).then(res => res.text());
	return newData;
}
const cached_fetch_300 = withTimeoutCache(fetch_url, { maxSize: 10, ttl: 1000 * 300 });
const cached_fetch_15 = withTimeoutCache(fetch_url, { maxSize: 10, ttl: 1000 * 15 });

function parse_ip_item(line) {
	const url = new URL("https://" + line);
	const ip = url.hostname;
	const hash = decodeURIComponent(url.hash ? url.hash.substring(1) : ''); // 去掉#
	const port = url.port; // 没写就为空
	return { ip, port, hash };
}

function parse_ip_text(content) {
	if (!content) return [];

	const processedContent = content.includes(',') && !content.includes('\n')
		? content.replace(/,/g, '\n')
		: content;

	return processedContent
		.split('\n')
		.map(line => line.trim())
		.filter(line => line)
		.map(line => parse_ip_item(line));
}

function group_ip_list_by_hash(ipList) {
	const grouped = Object.groupBy(ipList, item => item.hash);
	// 返回的是对象，键是hash值，值是数组
	// 如果需要Map格式，可以转换
	return new Map(Object.entries(grouped));
}

function 生成地址列表(addresses) {
	return addresses.map(({ ip, port, hash, remark }) =>
		port ? `${ip}:${port}#${remark}` : `${ip}#${remark}`
	);
}

async function handle_ip(url, context) {
	const region_limit = get_region_limit(url);
	const region_ip = group_ip_list_by_hash(parse_ip_text(context));
	const new_region_ip = ip_filter(region_ip, region_limit);
	let 列表 = 生成地址列表([...new_region_ip.values()].flat()).join("\n")
	return new Response(列表, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

async function handle_domain(url, context) {
	const limit = get_limit(url);
	const domain_list = parse_ip_text(context);
	let 列表 = 生成地址列表(domain_filter(domain_list, limit)).join("\n")
	return new Response(列表, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

async function handle_fetch(url) {
	const targetUrl = url.searchParams.get('url');
	const userAgent = url.searchParams.get('ua') || 'clash'; // 默认UA为clash
	if (!targetUrl) {
		return new Response('Missing url parameter', { status: 400 });
	}
	const resp = await fetch(decodeURIComponent(targetUrl), { headers: { 'User-Agent': userAgent } });
	return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: resp.headers });
}

function 更新协议链接(url, ip, port, hash) {
	const url1 = new URL(url);
	const uuid = url1.username;
	const security = url1.searchParams.get('security');
	url1.hostname = ip;
	url1.port = port ? port : security === 'tls' ? 443 : 80;
	url1.hash = `${uuid.slice(0, 4)}|${hash}`;
	return url1.href;
}

function 调整协议链接(url) {
	const url1 = new URL(url);
	const url2 = new URL(url1.searchParams.get('path'), "http://127.0.0.1");
	const ech = url1.searchParams.get('ech');
	if (ech) {
		// path中加ech=1
		url2.searchParams.set('ech', '1');
	}
	else {
		url2.searchParams.delete('ech');
	}
	url1.searchParams.set('path', url2.pathname + url2.search + url2.hash);
	return url1.href;
}

function 更新链接列表(addresses, nodes) {
	return addresses.map(({ ip, port, hash, remark }, i) => {
		const url = nodes[i % nodes.length];
		return 更新协议链接(url, ip, port, remark);
	});
}

function 调整链接列表(links) {
	return links.map(i => 调整协议链接(i));
}

function ip_filter(region_ip, region_limit) {
	const regionMap = new Map();
	for (const [region, limit] of region_limit) {
		const region_ip_list = region_ip.get(region);
		if (!region_ip_list) {
			regionMap.set(region, []);
		} else {
			const name = REGION_MAP[region] || '未知';
			// 随机一下，以免每次选出结果一
			const shuffled = Array.from(region_ip_list).sort(() => Math.random() - 0.5);
			const limitedList = shuffled.slice(0, limit).map((item, index) => ({ ...item, remark: `${item.hash} ${name} ${index + 1}` }));
			regionMap.set(region, limitedList);
		}
	}
	return regionMap;
}

function domain_filter(domain_list, limit) {
	const shuffled = Array.from(domain_list).sort(() => Math.random() - 0.5);
	const limitedList = shuffled.slice(0, limit).map((item, index) => ({ ...item, remark: `${item.hash}` }));
	return limitedList;
}

async function handle_ip_v2ray(url, context, base64) {
	const cf_nodes = parse_nodes(CF_NODES);
	const not_cf_nodes = parse_nodes(NOT_CF_NODES);
	const region_limit = get_region_limit(url);
	const region_ip = group_ip_list_by_hash(parse_ip_text(context));
	const new_region_ip = ip_filter(region_ip, region_limit);
	let 列表 = 更新链接列表([...new_region_ip.values()].flat(), cf_nodes);
	列表 = 调整链接列表(not_cf_nodes.concat(列表)).join("\n")
	if (base64) 列表 = btoa(列表);
	return new Response(列表, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

async function handle_domain_v2ray(url, context, base64) {
	const cf_nodes = parse_nodes(CF_NODES);
	const not_cf_nodes = parse_nodes(NOT_CF_NODES);
	const limit = get_limit(url);
	const domain_list = parse_ip_text(context);
	let 列表 = 更新链接列表(domain_filter(domain_list, limit), cf_nodes);
	列表 = 调整链接列表(not_cf_nodes.concat(列表)).join("\n")
	if (base64) 列表 = btoa(列表);
	return new Response(列表, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

function 生成订阅链接(url) {
	const new_url = new URL(`${CONVERT_URL}/sub?target=clash&emoji=false&scv=false`);
	new_url.searchParams.set('url', url);
	new_url.searchParams.set('config', CONFIG_URL);
	return new_url;
}
async function handle_sub(url) {
	let url_sub = new URL(url);
	url_sub.pathname = url_sub.pathname.replace('/sub', '/base64');
	url_sub = 生成订阅链接(url_sub);
	const url_clash = new URL(url);
	url_clash.pathname = url_clash.pathname.replace('/sub', '/clash');

	const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>订阅链接</title></head>
<body>
    <h3>订阅链接</h3>
    <p><strong>警告：</strong>通过以下链接订阅，ech 信息会丢失。部分节点开启 ech 反而无法上网</p>
    <div style="background:#f5f5f5; padding:10px; word-break:break-all; border:1px solid #ddd; font-family:monospace;">
        ${url_sub}
    </div>
	<p><strong></strong>通过以下链接订阅，ech 信息会根据配置参数尝试修复</p>
	<div style="background:#f5f5f5; padding:10px; word-break:break-all; border:1px solid #ddd; font-family:monospace;">
        ${url_clash}
    </div>
    <p>请复制上面的链接到您的客户端中使用</p>
</body>
</html>
    `;
	return new Response(htmlContent, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

function add_ech_to_yaml(yamlString) {
	return yamlString.replace(
		/(ws-opts.*?ech=1.*?)(}})(?![^}]*ech-opts)/g,
		`$1}}, ech-opts: {enable: true, query-server-name: ${ECH_SNI}}`
	);
}
async function handle_clash(url) {
	let url_sub = new URL(url);
	url_sub.pathname = url_sub.pathname.replace('/clash', '/base64');
	url_sub = 生成订阅链接(url_sub);
	// 订阅转换ech丢失，需要后期添加
	const content = await cached_fetch_15(url_sub.href);
	const updatedYaml = add_ech_to_yaml(content);
	return new Response(updatedYaml, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

function stringToBoolean(str) {
	if (!str) return false;
	const s = str.toLowerCase().trim();
	return s === "true" || s === "1" || s === "yes" || s === "on";
}
function zip(...arrays) {
	const length = Math.min(...arrays.map(arr => arr.length));
	return Array.from({ length }, (_, i) => arrays.map(arr => arr[i]));
}
function get_region_limit(url, max_limit = 30) {
	// 限制地区和数量的参数
	const region = (url.searchParams.get('region') || "HK-US").split('-');
	const limit = (url.searchParams.get('limit') || "5-5").split('-');
	const region_limit = zip(region, limit);
	return region_limit.map(([region, limit]) => [region, Math.min(parseInt(limit, 10), max_limit)]);
}

function get_limit(url, max_limit = 60) {
	const limit = url.searchParams.get('limit') || "20";
	return Math.min(parseInt(limit, 10), max_limit);
}
function parse_nodes(inputText) {
	console.log('parsing nodes');

	return inputText
		.split('\n')
		.map(line => line.trim())
		.filter(line => line && !line.startsWith('#'));
}


export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		switch (url.pathname) {
			case '/fetch':
				return await handle_fetch(url);
			case '/ip':
				BEST_IP_URL = env.BEST_DOMAINS || BEST_IP_URL;
				return await handle_ip(url, await cached_fetch_300(BEST_IP_URL));
			case '/domain':
				BEST_DOMAINS = env.BEST_DOMAINS || BEST_DOMAINS;
				return await handle_domain(url, BEST_DOMAINS);
			case '/ip/v2ray':
			case '/ip/base64':
				BEST_IP_URL = env.BEST_DOMAINS || BEST_IP_URL;
				CF_NODES = env.CF_NODES || CF_NODES;
				NOT_CF_NODES = env.NOT_CF_NODES || NOT_CF_NODES;
				return await handle_ip_v2ray(url, await cached_fetch_300(BEST_IP_URL), url.pathname.endsWith('/base64'));
			case '/domain/v2ray':
			case '/domain/base64':
				BEST_DOMAINS = env.BEST_DOMAINS || BEST_DOMAINS;
				CF_NODES = env.CF_NODES || CF_NODES;
				NOT_CF_NODES = env.NOT_CF_NODES || NOT_CF_NODES;
				return await handle_domain_v2ray(url, BEST_DOMAINS, url.pathname.endsWith('/base64'));
			case '/ip/sub':
			case '/domain/sub':
				CONVERT_URL = env.CONVERT_URL || CONVERT_URL;
				CONFIG_URL = env.CONVERT_URL || CONFIG_URL;
				return await handle_sub(url);
			case '/ip/clash':
			case '/domain/clash':
				CONVERT_URL = env.CONVERT_URL || CONVERT_URL;
				CONFIG_URL = env.CONVERT_URL || CONFIG_URL;
				return await handle_clash(url);
			default:
				return new Response('Hello World!');
		}
	},
};
