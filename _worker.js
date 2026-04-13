/////////////////////////////////////////////////////
// 一般情况下，只有以下小部分代码需要修改定制
/////////////////////////////////////////////////////
const PATH = "/proxyip=proxyip.cmliussss.net";

const CONVERT_URL = atob("aHR0cHM6Ly9zdWJhcGkuY21saXVzc3NzLm5ldA==");
const CONFIG_URL = "https://raw.githubusercontent.com/cmliu/ACL4SSR/main/Clash/config/ACL4SSR_Online.ini"

const ECH_SNI = "cloudflare-ech.com";
const ECH_FALLBACK = "https://223.5.5.5/dns-query";
// 只要配置文件中，ech为真，就用ECH替代
const ECH = `${ECH_SNI}+${ECH_FALLBACK}`;

// TODO 列表，来源不同，解析方式也不同，需要自行修改
async function fetch_addresses() {

	return await fetch_addresses_txt();

	// return await fetch_addresses_json();
}

// TODO 订阅优选IP列表，txt格式
async function fetch_addresses_txt() {
	const ip_list = await fetch("https://sub.995677.xyz/sub?joey").then(res => res.text());
	// const ip_list = await fetch("https://cf.090227.xyz/cu").then(res => res.text());
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
function stringToBoolean(str) {
	if (!str) return false;
	const s = str.toLowerCase().trim();
	return s === "true" || s === "1" || s === "yes" || s === "on";
}
function parseProxyConfig(inputText) {
	const lines = inputText.split('\n');
	const result = [];

	for (let line of lines) {
		line = line.trim();
		if (line === '' || line.startsWith('#')) {
			continue;
		}

		const parts = line.split(',');
		if (parts.length !== 4) {
			console.warn(`忽略格式不正确的行: ${line}`);
			continue;
		}

		// 5. 提取并清理字段（去除可能的首尾空格）
		const [uuid, sni, path, ech] = parts.map(part => part.trim());
		result.push({ uuid, sni, path: path || '/', ech: stringToBoolean(ech) });
	}

	return result;
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

function 生成协议链接(uuid, ip, port, sni, host, remark, path, ech) {
    const hash = `${uuid.slice(0, 4)}|${remark}`;
    let url = `${atob('dmxlc3M=')}://${uuid}@${ip}:${port}?security=tls&type=ws&host=${host}&fp=chrome&sni=${sni}&encryption=none#${hash}`;
    const url1 = new URL(url);
    if (ech) url1.searchParams.set('ech', ECH);
    if (path) {
        const url2 = new URL(path, "http://127.0.0.1");
        if (ech) url2.searchParams.set('ech', '1');
        url1.searchParams.set('path', url2.pathname + url2.search + url2.hash);
    }
    return url1.href;
}

function 生成链接列表(addresses) {
	const vv = [];

	for (let i = 0; i < addresses.length; i++) {
		const { ip, port, remark } = addresses[i];
		// 从地址列表中循环获取uuid和sni
		const { uuid, sni, path, ech } = NODES[i % NODES.length];
		const link = 生成协议链接(uuid, ip, port, sni, sni, remark, path, ech);
		vv.push(link);
	}

	return vv;
}

function 生成订阅链接(url) {
	const encodedUrl = encodeURIComponent(url);
	const encodedConfig = encodeURIComponent(CONFIG_URL);
	return `${CONVERT_URL}/sub?target=clash&url=${encodedUrl}&config=${encodedConfig}&emoji=false&scv=false`;
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
	const clash_url = `${origin}/clash`;

	const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>订阅链接</title></head>
<body>
    <h3>订阅链接</h3>
    <p><strong>警告：</strong>通过以下链接订阅，ech 信息会丢失。部分节点开启 ech 无法上网</p>
    <div style="background:#f5f5f5; padding:10px; word-break:break-all; border:1px solid #ddd; font-family:monospace;">
        ${sub_url}
    </div>
	<p><strong></strong>通过以下链接订阅，ech 信息会尝试修复</p>
	<div style="background:#f5f5f5; padding:10px; word-break:break-all; border:1px solid #ddd; font-family:monospace;">
        ${clash_url}
    </div>
    <p>请复制上面的链接到您的客户端中使用</p>
</body>
</html>
    `;

	return new Response(htmlContent, {
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': 'no-store',
			'Expires': '0'
		}
	});
}

function modifyYamlProxies(yamlString) {
	// 使用正则表达式找到每个代理配置的结束位置
	const lines = yamlString.split('\n');
	const result = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		// 检查是否是代理配置行
		if (line.includes('ws-opts') && line.endsWith('}}') && line.includes('ech=1') && !line.includes('ech-opts')) {
			// 在末尾添加 ech-opts
			const modifiedLine = line.replace(/}}$/, `}, ech-opts: {enable: true, query-server-name: ${ECH_SNI}}}`);
			result.push(modifiedLine);
		} else {
			result.push(line);
		}
	}

	return result.join('\n');
}

async function handle_clash(url) {
	const origin = url.origin; // 获取当前服务器的源地址
	const base64Url = `${origin}/base64`; // 构造/base64的完整URL
	const sub_url = 生成订阅链接(base64Url)
	// 订阅转换ech丢失，需要后期添加
	const content = await fetch(sub_url).then(res => res.text());

	const updatedYaml = modifyYamlProxies(content);

	return new Response(updatedYaml, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Expires': '0' } });
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

let NODES = [];

export default {
	async fetch(request, env, ctx) {
		try {
			// TODO 泄漏CF账号的数据，请自行修改
			NODES = parseProxyConfig(env.NODES || `

# https://xxx.eu.cc/sub?token=1e0294bba5c6960fe5f5e600f0a883c9
00000000-0000-4000-8000-000000000000,xxx.eu.cc,/proxyip=proxyip.cmliussss.net,true

# https://xxx.xxxx.de5.net/sub?token=1d5638ceae20667ab8ddef752cae99bf
11111111-1111-4111-8111-111111111111,xxx.xxxx.de5.net,/proxyip=proxyip.cmliussss.net?ed=2095,false

				`);
			console.log(NODES);
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