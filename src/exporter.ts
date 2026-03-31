import { App, Component, MarkdownRenderer } from "obsidian";
import type { MdExportSettings } from "./settings";

const BASE_CSS = `
/* Exported from Obsidian — Markdown Export plugin */
:root { color-scheme: light; }
body {
	max-width: 800px;
	margin: 0 auto;
	padding: 2rem 1.5rem;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
		Helvetica, Arial, sans-serif;
	font-size: 16px;
	line-height: 1.6;
	color: #1a1a1a;
	background: #fff;
}
h1, h2, h3, h4, h5, h6 { margin-top: 1.4em; margin-bottom: 0.5em; line-height: 1.3; }
h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
h3 { font-size: 1.25em; }
a { color: #0969da; text-decoration: none; }
a:hover { text-decoration: underline; }
code {
	background: #f0f0f0;
	padding: 0.2em 0.4em;
	border-radius: 3px;
	font-size: 0.9em;
}
pre {
	background: #f6f8fa;
	padding: 1em;
	border-radius: 6px;
	overflow-x: auto;
}
pre code { background: none; padding: 0; }
blockquote {
	border-left: 3px solid #ddd;
	margin-left: 0;
	padding-left: 1em;
	color: #555;
}
img { max-width: 100%; height: auto; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; }
th, td { border: 1px solid #ddd; padding: 0.5em 0.75em; text-align: left; }
th { background: #f6f8fa; font-weight: 600; }
hr { border: none; border-top: 1px solid #eee; margin: 2em 0; }
ul, ol { padding-left: 1.5em; }
li { margin: 0.25em 0; }
.frontmatter-table { background: #f8f9fa; border-radius: 6px; padding: 1em; margin-bottom: 1.5em; }
.frontmatter-table th { background: transparent; border: none; color: #666; font-weight: 500; padding: 0.2em 1em 0.2em 0; }
.frontmatter-table td { border: none; padding: 0.2em 0; }
@media print {
	body { max-width: none; padding: 0; }
	a { color: inherit; }
}
`;

export async function renderNoteToHtml(
	app: App,
	markdown: string,
	sourcePath: string,
	settings: MdExportSettings
): Promise<string> {
	// Strip frontmatter from markdown unless we want to include it
	let body = markdown;
	let frontmatter: Record<string, string> | null = null;

	const fmMatch = markdown.match(/^---\n([\s\S]*?)\n---\n/);
	if (fmMatch) {
		body = markdown.substring(fmMatch[0].length);
		if (settings.includeFrontmatter) {
			frontmatter = parseFrontmatter(fmMatch[1]);
		}
	}

	// Render markdown to HTML using Obsidian's renderer
	const container = document.createElement("div");
	const component = new Component();
	component.load();

	try {
		await MarkdownRenderer.render(app, body, container, sourcePath, component);
	} finally {
		component.unload();
	}

	// Build frontmatter table if needed
	let fmHtml = "";
	if (frontmatter && Object.keys(frontmatter).length > 0) {
		const rows = Object.entries(frontmatter)
			.map(
				([k, v]) =>
					`<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`
			)
			.join("\n");
		fmHtml = `<table class="frontmatter-table"><tbody>${rows}</tbody></table>`;
	}

	// Embed images as base64 data URIs
	const renderedHtml = await embedImages(app, container.innerHTML, sourcePath);

	const title = extractTitle(body, sourcePath);
	const customCss = settings.customCss ? `\n${settings.customCss}\n` : "";

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style>${BASE_CSS}${customCss}</style>
</head>
<body>
${fmHtml}
${renderedHtml}
</body>
</html>`;
}

async function embedImages(
	app: App,
	html: string,
	sourcePath: string
): Promise<string> {
	// Find all image src attributes that are local vault paths
	const imgRegex = /(<img[^>]*\ssrc=")([^"]+)("[^>]*>)/g;
	const replacements: Array<{ original: string; replacement: string }> = [];

	let match;
	while ((match = imgRegex.exec(html)) !== null) {
		const src = match[2];
		// Skip data URIs and external URLs
		if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")) {
			continue;
		}

		try {
			// Resolve the image path relative to the source note
			const resolvedPath = resolveVaultPath(app, src, sourcePath);
			const file = app.vault.getAbstractFileByPath(resolvedPath);
			if (file && file instanceof (await import("obsidian")).TFile) {
				const data = await app.vault.readBinary(file);
				const ext = file.extension.toLowerCase();
				const mime = getMimeType(ext);
				const base64 = arrayBufferToBase64(data);
				const dataUri = `data:${mime};base64,${base64}`;
				replacements.push({
					original: match[0],
					replacement: `${match[1]}${dataUri}${match[3]}`,
				});
			}
		} catch {
			// Skip images we can't resolve
		}
	}

	let result = html;
	for (const r of replacements) {
		result = result.replace(r.original, r.replacement);
	}
	return result;
}

function resolveVaultPath(app: App, src: string, sourcePath: string): string {
	// Try as-is first (might be a vault-absolute path)
	if (app.vault.getAbstractFileByPath(src)) return src;

	// Decode URI encoding
	const decoded = decodeURIComponent(src);
	if (app.vault.getAbstractFileByPath(decoded)) return decoded;

	// Try relative to the source file's directory
	const sourceDir = sourcePath.includes("/")
		? sourcePath.substring(0, sourcePath.lastIndexOf("/"))
		: "";
	const relative = sourceDir ? `${sourceDir}/${decoded}` : decoded;
	if (app.vault.getAbstractFileByPath(relative)) return relative;

	// Try using Obsidian's link resolution
	const resolved = app.metadataCache.getFirstLinkpathDest(decoded, sourcePath);
	if (resolved) return resolved.path;

	return decoded;
}

function extractTitle(markdown: string, sourcePath: string): string {
	const headingMatch = markdown.match(/^#\s+(.+)$/m);
	if (headingMatch) return headingMatch[1].trim();
	// Fall back to filename
	const parts = sourcePath.split("/");
	const filename = parts[parts.length - 1];
	return filename.replace(/\.md$/, "");
}

function parseFrontmatter(raw: string): Record<string, string> {
	const result: Record<string, string> = {};
	for (const line of raw.split("\n")) {
		const colonIdx = line.indexOf(":");
		if (colonIdx === -1) continue;
		const key = line.substring(0, colonIdx).trim();
		const value = line.substring(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
		if (key) result[key] = value;
	}
	return result;
}

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function getMimeType(ext: string): string {
	const mimes: Record<string, string> = {
		png: "image/png",
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		gif: "image/gif",
		svg: "image/svg+xml",
		webp: "image/webp",
		bmp: "image/bmp",
	};
	return mimes[ext] || "application/octet-stream";
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let binary = "";
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}
