
/////////////////////////////////////////////////////
// 一般情况下，只有以下小部分代码需要修改定制
/////////////////////////////////////////////////////
const ECH = "cloudflare-ech.com+https://223.5.5.5/dns-query";
const PATH = "/proxyip=proxyip.cmliussss.net";

const CONVERT_URL = 'https://url.v1.mk';
const CONFIG_URL = "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online.ini"

// TODO 列表，来源不同，解析方式也不同，需要自行修改
async function fetch_addresses() {

	// return await fetch_addresses_txt();

	return await fetch_addresses_json();
}

// TODO 订阅优选IP列表，txt格式
async function fetch_addresses_txt() {
	const ip_list = await fetch("https://sub.995677.xyz/sub?joey").then(res => res.text());
	return parseIpContent(ip_list);
}
// TODO 订阅优选IP列表，json格式
async function fetch_addresses_json() {
	const response = await fetch("https://ip.v2too.top/api/nodes");
	const jsonData = await response.json();

	return jsonData.data.map(item => ({
		ip: item.ip,
		port: 443, // 从JSON中可以看出端口通常是443，但文档中没有port字段，所以默认使用443
		remark: `${item.carrier}_${item.region}` // 格式为"carrier_region"
	}));
}
/////////////////////////////////////////////////////
// 一般情况下，只有以上小部分代码需要修改定制
/////////////////////////////////////////////////////

function parseUUID_SNI(input) {
	const lines = input.split('\n');

	return lines
		// 过滤空行和只有空白字符的行
		.filter(line => {
			const trimmed = line.trim();
			// 排除空行/空白行，以及以 // 或 # 开头的行
			return trimmed !== '' && 
			       !trimmed.startsWith('//') && 
			       !trimmed.startsWith('#');
		})
		// 解析每一行
		.map(line => {
			// 按逗号分割，最多分割成两部分
			const parts = line.split(',').map(part => part.trim());
			return [parts[0], parts[1]];
		})
		// 过滤无效条目（缺少UUID或域名）
		.filter(item => item[0] && item[1]);
}

function parseServerData(line, defaultPort = 443) {
	// 分割服务器部分和备注
	const parts = line.split('#');
	const serverPart = parts[0].trim();
	const remark = parts.length > 1 ? parts[1].trim() : "";

	let ip, port;

	// 分割IP和端口
	if (serverPart.includes(':')) {
		const ipPort = serverPart.split(':');
		ip = ipPort[0];
		port = parseInt(ipPort[1]);
	} else {
		ip = serverPart;
		port = defaultPort;
	}
	return { ip, port, remark };
}

function parseIpContent(content) {
	if (!content) {
		return [];
	}

	// 自动检测分隔符
	let processedContent = content;
	if (content.includes(',') && !content.includes('\n')) {
		// 只有逗号，没有换行
		processedContent = content.replace(/,/g, '\n');
	}

	const lines = processedContent.split('\n');
	const result = [];

	for (const line of lines) {
		const trimmedLine = line.trim();
		if (trimmedLine) {
			result.push(parseServerData(trimmedLine, 443));
		}
	}
	return result;
}

function 生成协议链接(uuid, ip, port, sni, host, remark) {
	const ech = encodeURIComponent(ECH);
	const path = encodeURIComponent(PATH);
	const comment = encodeURIComponent(`${uuid.slice(0, 4)}|${remark}`);
	return `${atob('dmxlc3M=')}://${uuid}@${ip}:${port}?encryption=none&&security=tls&sni=${sni}&fp=chrome&ech=${ech}&type=ws&host=${host}&path=${path}#${comment}`;
}

function 生成链接列表(addresses) {
	const vv = [];

	for (let i = 0; i < addresses.length; i++) {
		const { ip, port, remark } = addresses[i];
		// 从地址列表中循环获取uuid和sni
		const [uuid, sni] = UUID_SNI[i % UUID_SNI.length];
		const link = 生成协议链接(uuid, ip, port, sni, sni, remark);
		vv.push(link);
	}

	return vv;
}

function 生成订阅链接(url) {
	const encodedUrl = encodeURIComponent(url);
	const encodedConfig = encodeURIComponent(CONFIG_URL);
	return `${CONVERT_URL}/sub?target=clash&url=${encodedUrl}&insert=false&config=${encodedConfig}&emoji=false&list=false&xudp=false&udp=false&tfo=false&expand=true&scv=false&fdn=false&new_name=true`;
}

async function handle_raw() {
	let addresses = await fetch_addresses();
	let 列表 = 生成链接列表(addresses).join("\n")
	return new Response(列表, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

async function handle_base64() {
	let addresses = await fetch_addresses();
	let 列表 = 生成链接列表(addresses).join("\n")
	return new Response(btoa(列表), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

async function handle_sub(url) {
	const origin = url.origin; // 获取当前服务器的源地址
	const base64Url = `${origin}/base64`; // 构造/base64的完整URL
	const sub_url = 生成订阅链接(base64Url)

	return new Response(sub_url, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

async function handle_clash(url) {
	const origin = url.origin; // 获取当前服务器的源地址
	const base64Url = `${origin}/base64`; // 构造/base64的完整URL
	const sub_url = 生成订阅链接(base64Url)
	const content = await fetch(sub_url).then(res => res.text());

	return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

// TODO 转发订阅，可用于添加UA
async function handle_fetch(url) {
	const targetUrl = url.searchParams.get('url');
	const userAgent = url.searchParams.get('ua') || 'clash'; // 默认UA为clash
	if (!targetUrl) {
		return new Response('Missing url parameter', { status: 400 });
	}
	const decodedUrl = decodeURIComponent(targetUrl);

	let txt = await fetch(decodedUrl, { headers: { 'User-Agent': userAgent } }).then(response => response.text());

	return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
}

let UUID_SNI = [];

export default {
	async fetch(request, env, ctx) {
		try {
			// TODO 泄漏CF账号的数据，请自行修改
			UUID_SNI = parseUUID_SNI(env.UUID_SNI || `
				// https://xxx.eu.cc/sub?token=1e0294bba5c6960fe5f5e600f0a883c9
				00000000-0000-4000-8000-000000000000,xxx.eu.cc

				# https://xxx.xxxx.de5.net/sub?token=1d5638ceae20667ab8ddef752cae99bf
				11111111-1111-4111-8111-111111111111,xxx.xxxx.de5.net
				`);
			console.log(UUID_SNI);
		} catch (e) {
			console.log(e);
			return new Response(e.message, { status: 500 });
		}

		const url = new URL(request.url);
		const pathname = url.pathname;

		if (pathname.startsWith('/v2ray')) {
			return await handle_raw();
		}
		if (pathname.startsWith('/base64')) {
			return await handle_base64();
		}
		if (pathname.startsWith('/sub')) {
			return await handle_sub(url);
		}
		if (pathname.startsWith('/clash')) {
			return await handle_clash(url);
		}
		if (pathname.startsWith('/fetch')) {
			return await handle_fetch(url);
		}

		// You can view your logs in the Observability dashboard
		console.info({ message: 'Hello World Worker received a request!' });
		return new Response('Hello World!');
	}
};