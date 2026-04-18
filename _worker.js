// ECH配置
const ECH_SNI = "cloudflare-ech.com";
const HOME_HTML = "https://raw.githubusercontent.com/wukan1986/cf-nodes-aggregator/main/home.html";
const LINK_HTML = "https://raw.githubusercontent.com/wukan1986/cf-nodes-aggregator/main/link.html";
// const HOME_HTML = "http://127.0.0.1:8080/home.html";
// const LINK_HTML = "http://127.0.0.1:8080/link.html";
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
	if (!url) return '';
	console.log('fetching', url);
	const newData = await fetch(url).then(res => res.text());
	return newData;
}
const cached_fetch_30 = withTimeoutCache(fetch_url, { maxSize: 10, ttl: 1000 * 30 });
const cached_fetch_15 = withTimeoutCache(fetch_url, { maxSize: 10, ttl: 1000 * 15 });

function parse_hostname_item(line) {
	// 支持从vless提取hostname, 也支持从`127.0.0.1:443#备注`提取hostname
	const url = new URL(line.includes('://') ? line : "https://" + line);
	const hostname = url.hostname;
	const hash = decodeURIComponent(url.hash ? url.hash.substring(1) : ''); // 去掉#
	const port = url.port; // 没写就为空
	return { hostname, port, hash };
}

function parse_hostname_text(content) {
	if (!content) return [];

	const processedContent = content.includes(',') && !content.includes('\n')
		? content.replace(/,/g, '\n')
		: content;

	return processedContent
		.split('\n')
		.map(line => line.trim())
		.filter(line => line)
		.map(line => parse_hostname_item(line));
}

function group_hostnames_by_hash(hostnames) {
	const grouped = Object.groupBy(hostnames, item => item.hash);
	// 返回的是对象，键是hash值，值是数组
	// 如果需要Map格式，可以转换
	return new Map(Object.entries(grouped));
}

function 生成地址列表(addresses) {
	return addresses.map(({ hostname, port, hash, remark }) =>
		port ? `${hostname}:${port}#${remark}` : `${hostname}#${remark}`
	);
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


// 解码：Latin-1字符串 -> UTF-8字节 -> 正常字符串
const decodeGarbledText = s => new TextDecoder().decode(Uint8Array.from(s, c => c.charCodeAt()));
// 编码：字符串 -> UTF-8字节 -> Latin-1字符串
const encodeToGarbled = s => new TextEncoder().encode(s).reduce((str, byte) => str + String.fromCharCode(byte), '');


function 更新协议链接(url, hostname, port, hash) {
	if (url.startsWith('vmess://')) {
		// vmess
		const config = JSON.parse(atob(url.substring(8)));
		config.add = hostname;
		config.port = port ? port : config.tls === 'tls' ? '443' : '80';
		config.ps = encodeToGarbled(`${config.id.slice(0, 4)}|${hash}`);
		return 'vmess://' + btoa(JSON.stringify(config, null, 0));
	}
	else {
		// vless/trojan/ss
		const url1 = new URL(url);
		const uuid = url1.username;
		const security = url1.searchParams.get('security');
		url1.hostname = hostname;
		url1.port = port ? port : security === 'tls' ? 443 : 80;
		url1.hash = `${uuid.slice(0, 4)}|${hash}`;
		return url1.href;
	}
}

function 调整协议链接(url) {
	if (url.startsWith('vmess://'))
		return url;

	const url1 = new URL(url);
	const path = url1.searchParams.get('path');
	if (!path) return url;
	const url2 = new URL(path, "http://127.0.0.1");
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
	if (nodes.length === 0) return [];
	if (addresses.length === 0) return nodes;
	return addresses.map(({ hostname, port, hash, remark }, i) => {
		const url = nodes[i % nodes.length];
		return 更新协议链接(url, hostname, port, remark);
	});
}

function 调整链接列表(links) {
	return links.map(i => 调整协议链接(i));
}

function hostnames_limit_region(region_hostname, limit_region) {
	const regionMap = new Map();
	for (const [limit, region] of limit_region) {
		const hostnames_part = region_hostname.get(region);
		if (!hostnames_part) {
			regionMap.set(region, []);
		} else {
			const name = REGION_MAP[region] || '未知地区';
			// 随机一下，以免每次选出结果一
			const shuffled = Array.from(hostnames_part).sort(() => Math.random() - 0.5);
			const limitedList = shuffled.slice(0, limit).map((item, index) => ({ ...item, remark: `${item.hash} ${name} ${index + 1}` }));
			regionMap.set(region, limitedList);
		}
	}
	return [...regionMap.values()].flat();
}

function hostnames_limit(hostnames, limit) {
	const shuffled = Array.from(hostnames).sort(() => Math.random() - 0.5);
	return shuffled.slice(0, limit).map((item, index) => ({ ...item, remark: `${item.hash} ${index + 1}` }));
}

function 生成订阅链接(url, target, convert_url, config_url) {
	const new_url = new URL(convert_url + "/sub?target=" + target + "&insert=false&emoji=false&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true");
	new_url.searchParams.set('url', url);
	new_url.searchParams.set('config', config_url);
	return new_url;
}

function 生成服务链接(url, nodes, hostnames, region, limit, format) {
	const new_url = new URL(url);
	new_url.pathname = '/' + format;
	if (nodes) new_url.searchParams.set('nodes', nodes);
	if (hostnames) {
		new_url.searchParams.set('nodes', hostnames);
		if (region) new_url.searchParams.set('region', region);
		if (limit) new_url.searchParams.set('limit', limit);
	}
	return new_url;
}

function 生成补丁链接(url1, format, url2) {
	const new_url = new URL(url1);
	new_url.pathname = '/' + format;
	new_url.searchParams.set('url', url2);
	return new_url;
}

function add_ech_to_clash(yamlString) {
	return yamlString.replace(
		/(ws-opts.*?ech=1.*?)(}})(?![^}]*ech-opts)/g,
		`$1}}, ech-opts: {enable: true, query-server-name: ${ECH_SNI}}`
	);
}

function add_ech_to_singbox(jsonString) {
	let config = JSON.parse(jsonString);
	config.outbounds.forEach(outbound => {
		// 检查是否有transport配置且path中包含ech=1
		if (outbound.transport &&
			outbound.transport.path &&
			outbound.transport.path.includes("ech=1") &&
			outbound.tls &&
			outbound.tls.enabled) {

			outbound.tls.ech = {
				"enabled": true,
				"query_server_name": ECH_SNI
			};
		}
	});
	return JSON.stringify(config, null, 2);
}
async function handle_clash(url) {
	const _url = url.searchParams.get('url');
	// 订阅转换ech丢失，需要后期添加
	const content = await cached_fetch_15(_url);
	return new Response(add_ech_to_clash(content), { headers: { 'Content-Type': 'text/yaml; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

async function handle_singbox(url) {
	const _url = url.searchParams.get('url');
	// 订阅转换ech丢失，需要后期添加
	const content = await cached_fetch_15(_url);
	return new Response(add_ech_to_singbox(content), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

function zip(...arrays) {
	const length = Math.min(...arrays.map(arr => arr.length));
	return Array.from({ length }, (_, i) => arrays.map(arr => arr[i]));
}
function get_limit_region(url, max_limit = 30) {
	// 限制地区和数量的参数
	const limit = (url.searchParams.get('limit') || "1").split('-');
	const region = (url.searchParams.get('region') || "").split('-');
	return zip(limit, region).map(([a, b]) => [Math.min(parseInt(a, 10), max_limit), b]);
}

function get_limit(url, max_limit = 60) {
	const limit = (url.searchParams.get('limit') || "1").split('-');
	return limit.map(a => Math.min(parseInt(a, 10), max_limit))[0];
}

function parse_new_line(inputText) {
	return inputText
		.split('\n')
		.map(line => line.trim())
		.filter(line => line && !line.startsWith('#'));
}

async function handle_extract(url) {
	let hostnames = await fetch_hostnames(url.searchParams.get('hostname'));
	console.log(hostnames);
	if (url.searchParams.get('region')) {
		hostnames = hostnames_limit_region(group_hostnames_by_hash(hostnames), get_limit_region(url, 30));
		// 限制最多60条
		hostnames = hostnames_limit(hostnames, 80);
	}
	else {
		// 限制最多60条
		hostnames = hostnames_limit(hostnames, get_limit(url, 80))
	}
	return new Response(JSON.stringify(hostnames, null, 0), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

async function handle_v2ray(url, base64) {
	let hostnames = await fetch_hostnames(url.searchParams.get('hostnames'));
	console.log(hostnames);
	if (url.searchParams.get('region')) {
		hostnames = hostnames_limit_region(group_hostnames_by_hash(hostnames), get_limit_region(url, 30));
		// 限制最多60条
		hostnames = hostnames_limit(hostnames, 80);
	}
	else {
		// 限制最多60条
		hostnames = hostnames_limit(hostnames, get_limit(url, 80))
	}

	const content = await await cached_fetch_30(url.searchParams.get('nodes'));
	const txt = content.includes('.') ? content : atob(content);
	let nodes = parse_new_line(txt);
	console.log(nodes);
	nodes = 更新链接列表(hostnames, nodes)
	nodes = 调整链接列表(nodes).join("\n")
	if (base64) nodes = btoa(nodes);
	return new Response(nodes, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

async function fetch_hostnames(target_url) {
	if (!target_url) return [];
	if (target_url.startsWith("sub://")) {
		target_url = `${target_url.replace("sub://", "https://")}/sub?host=example.com&uuid=00000000-0000-4000-8000-000000000000`;
	}
	const content = await cached_fetch_30(target_url);
	const txt = content.includes('.') ? content : atob(content);
	return parse_hostname_text(txt);
}

async function handle_home(url) {
	const text = await await cached_fetch_30(HOME_HTML);
	return new Response(text, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}


async function handle_link(url) {
	const text = await await cached_fetch_30(LINK_HTML);
	return new Response(text, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

async function handle_link_edit(url, request, env) {
	const auth = await apiKeyAuth(request, env);
	if (!auth.authenticated) {
		return new Response('Unauthorized', {
			status: 401,
			headers: { 'WWW-Authenticate': 'Bearer' }
		});
	}

	const STORAGE = env.KV;
	if (!STORAGE) return new Response('No KV storage available', { status: 500 });

	const method = request.method;
	if (method === 'GET') {
		const data = await STORAGE.get('link.json', { type: 'json' })||[];
		const txt = JSON.stringify(data)
		return new Response(txt, { headers: { 'Content-Type': 'text/json; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
	}
	if (method === 'POST') {
		const data = await request.json();
		const txt = JSON.stringify(data)
		const links = await STORAGE.put('link.json', txt);
		return new Response(txt, { headers: { 'Content-Type': 'text/json; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
	}
}

async function handle_s(url, env) {
	const STORAGE = env.KV;
	if (!STORAGE) return new Response('No KV storage available', { status: 500 });
	const data = await STORAGE.get('link.json', { type: 'json' });

	if (!data) {
		return new Response('No data found', { status: 404 });
	}

	// 查找匹配的链接
	for (const [key, item] of Object.entries(data)) {
		if (item.link === url.href) {
			if (item.type === '文本') {
				// 直接返回 note 内容
				return new Response(item.note || '', {
					headers: { 'Content-Type': 'text/plain; charset=utf-8' }
				});
			} else if (item.type === '转发') {
				// 转发到 link 的内容
				try {
					const response = await fetch(item.note);
					return response;
				} catch (error) {
					return new Response(`Forward failed: ${error.message}`, { status: 500 });
				}
			} else if (item.type === '跳转') {
				// 307 跳转到 link
				return new Response(null, {
					status: 307,
					headers: {
						'Location': item.note
					}
				});
			} else {
				return new Response(`Unknown type: ${item.type}`, { status: 400 });
			}
		}
	}

	// 没有找到匹配的链接
	return new Response('Link not found', { status: 404 });
}

async function apiKeyAuth(request, env) {
	const authHeader = request.headers.get('Authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return { authenticated: false };
	}

	const apiKey = authHeader.substring(7);
	const validKey = env.API_KEY; // 在wrangler.toml或环境变量中设置

	return {
		authenticated: apiKey === validKey,
		apiKey: apiKey
	};
}

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		if (url.pathname.startsWith('/s/')) {
			return await handle_s(url, env);
		}

		switch (url.pathname) {
			case '/fetch':
				return await handle_fetch(url);
			case '/extract':
				return await handle_extract(url);
			case '/v2ray':
				return await handle_v2ray(url, false);
			case '/base64':
				return await handle_v2ray(url, true);
			case '/clash':
				return await handle_clash(url);
			case '/singbox':
				return await handle_singbox(url);
			case '/home':
				return await handle_home(url);
			case '/link':
				return await handle_link(url);
			case '/link/edit':
				return await handle_link_edit(url, request, env);

			default:
				return new Response('Hello World!');
		}
	},
};

