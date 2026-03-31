var y=Object.defineProperty;var S=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var E=Object.prototype.hasOwnProperty;var M=(i,a)=>{for(var e in a)y(i,e,{get:a[e],enumerable:!0})},P=(i,a,e,t)=>{if(a&&typeof a=="object"||typeof a=="function")for(let o of T(a))!E.call(i,o)&&o!==e&&y(i,o,{get:()=>a[o],enumerable:!(t=S(a,o))||t.enumerable});return i};var A=i=>P(y({},"__esModule",{value:!0}),i);var z={};M(z,{default:()=>f});module.exports=A(z);var l=require("obsidian");var m=require("obsidian"),w={includeFrontmatter:!1,defaultFormat:"html",customCss:""},g=class extends m.PluginSettingTab{constructor(a,e){super(a,e),this.plugin=e}display(){let{containerEl:a}=this;a.empty(),new m.Setting(a).setName("Default export format").setDesc("Format used by the default export command.").addDropdown(e=>e.addOption("html","HTML").addOption("pdf","PDF (via print)").setValue(this.plugin.settings.defaultFormat).onChange(async t=>{this.plugin.settings.defaultFormat=t,await this.plugin.saveSettings()})),new m.Setting(a).setName("Include frontmatter").setDesc("Include YAML frontmatter as a metadata table in the export.").addToggle(e=>e.setValue(this.plugin.settings.includeFrontmatter).onChange(async t=>{this.plugin.settings.includeFrontmatter=t,await this.plugin.saveSettings()})),new m.Setting(a).setName("Custom CSS").setDesc("Additional CSS to include in exported files.").addTextArea(e=>e.setPlaceholder("body { font-family: serif; }").setValue(this.plugin.settings.customCss).onChange(async t=>{this.plugin.settings.customCss=t,await this.plugin.saveSettings()}))}};var p=require("obsidian"),$=`
/* Exported from Obsidian \u2014 Markdown Export plugin */
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

/* Headings */
h1, h2, h3, h4, h5, h6 { margin-top: 1.4em; margin-bottom: 0.5em; line-height: 1.3; }
h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
h3 { font-size: 1.25em; }

/* Links */
a { color: #0969da; text-decoration: none; }
a:hover { text-decoration: underline; }
a.internal-link { color: #7c3aed; }
a.tag { color: #0969da; background: #dbeafe; padding: 0.1em 0.4em; border-radius: 3px; font-size: 0.85em; }

/* Inline code */
code {
	background: #f0f0f0;
	padding: 0.2em 0.4em;
	border-radius: 3px;
	font-size: 0.9em;
	font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

/* Code blocks */
pre {
	background: #f6f8fa;
	padding: 1em;
	border-radius: 6px;
	overflow-x: auto;
	font-size: 0.875em;
	line-height: 1.5;
}
pre code { background: none; padding: 0; font-size: inherit; }

/* Syntax highlighting (Obsidian uses CodeMirror classes) */
.cm-keyword, .token.keyword { color: #d73a49; }
.cm-string, .token.string { color: #032f62; }
.cm-comment, .token.comment { color: #6a737d; font-style: italic; }
.cm-number, .token.number { color: #005cc5; }
.cm-def, .token.function { color: #6f42c1; }
.cm-variable, .token.variable { color: #e36209; }
.cm-property, .token.property { color: #005cc5; }
.cm-operator, .token.operator { color: #d73a49; }
.cm-tag, .token.tag { color: #22863a; }
.cm-attribute, .token.attr-name { color: #6f42c1; }
.cm-type, .token.class-name { color: #6f42c1; }
.cm-builtin { color: #005cc5; }
.cm-meta { color: #735c0f; }

/* Blockquotes */
blockquote {
	border-left: 3px solid #ddd;
	margin-left: 0;
	padding-left: 1em;
	color: #555;
}

/* Callouts (Obsidian renders these as .callout) */
.callout {
	border-left: 4px solid #448aff;
	background: #f0f4ff;
	border-radius: 4px;
	padding: 0.75em 1em;
	margin: 1em 0;
}
.callout-title {
	font-weight: 600;
	margin-bottom: 0.25em;
	display: flex;
	align-items: center;
	gap: 0.4em;
}
.callout-icon { display: inline-flex; }
.callout[data-callout="warning"] { border-left-color: #ff9100; background: #fff8e1; }
.callout[data-callout="danger"], .callout[data-callout="error"] { border-left-color: #ff5252; background: #ffebee; }
.callout[data-callout="success"], .callout[data-callout="check"], .callout[data-callout="done"] { border-left-color: #4caf50; background: #e8f5e9; }
.callout[data-callout="tip"], .callout[data-callout="hint"] { border-left-color: #00bcd4; background: #e0f7fa; }
.callout[data-callout="question"], .callout[data-callout="help"] { border-left-color: #ff9800; background: #fff3e0; }
.callout[data-callout="example"] { border-left-color: #7c4dff; background: #f3e8fd; }
.callout[data-callout="quote"], .callout[data-callout="cite"] { border-left-color: #9e9e9e; background: #f5f5f5; }

/* Images */
img { max-width: 100%; height: auto; border-radius: 4px; }

/* Tables */
table { border-collapse: collapse; width: 100%; margin: 1em 0; }
th, td { border: 1px solid #ddd; padding: 0.5em 0.75em; text-align: left; }
th { background: #f6f8fa; font-weight: 600; }
tr:nth-child(even) { background: #fafbfc; }

/* Horizontal rules */
hr { border: none; border-top: 1px solid #eee; margin: 2em 0; }

/* Lists */
ul, ol { padding-left: 1.5em; }
li { margin: 0.25em 0; }

/* Checkboxes / task lists */
.task-list-item { list-style: none; margin-left: -1.5em; }
.task-list-item-checkbox, input[type="checkbox"] {
	margin-right: 0.4em;
	width: 1em;
	height: 1em;
	vertical-align: middle;
}

/* Footnotes */
.footnotes { border-top: 1px solid #eee; margin-top: 2em; padding-top: 1em; font-size: 0.9em; }
.footnote-ref { font-size: 0.75em; vertical-align: super; }

/* Math (MathJax / KaTeX) */
.math, .MathJax, .katex { overflow-x: auto; }
.math-block, .MathJax_Display, .katex-display { margin: 1em 0; text-align: center; }
mjx-container { overflow-x: auto; max-width: 100%; }

/* Mermaid diagrams */
.mermaid svg { max-width: 100%; height: auto; }

/* Embedded content */
.internal-embed { border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.75em; margin: 0.5em 0; background: #fafbfc; }

/* Frontmatter table */
.frontmatter-table { background: #f8f9fa; border-radius: 6px; padding: 1em; margin-bottom: 1.5em; }
.frontmatter-table th { background: transparent; border: none; color: #666; font-weight: 500; padding: 0.2em 1em 0.2em 0; }
.frontmatter-table td { border: none; padding: 0.2em 0; }

/* Print styles */
@media print {
	body { max-width: none; padding: 0; }
	a { color: inherit; }
	pre { white-space: pre-wrap; word-wrap: break-word; }
	.callout { break-inside: avoid; }
	table { break-inside: avoid; }
	img { break-inside: avoid; }
	h1, h2, h3 { break-after: avoid; }
}
`;async function C(i,a,e,t){let o=a,n=null,r=a.match(/^---\n([\s\S]*?)\n---\n/);r&&(o=a.substring(r[0].length),t.includeFrontmatter&&(n=I(r[1])));let s=document.createElement("div"),d=new p.Component;d.load();try{await p.MarkdownRenderer.render(i,o,s,e,d)}finally{d.unload()}let c="";n&&Object.keys(n).length>0&&(c=`<table class="frontmatter-table"><tbody>${Object.entries(n).map(([x,F])=>`<tr><th>${k(x)}</th><td>${k(F)}</td></tr>`).join(`
`)}</tbody></table>`);let u=await D(i,s.innerHTML,e),h=H(o,e),b=t.customCss?`
${t.customCss}
`:"";return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${k(h)}</title>
<style>${$}${b}</style>
</head>
<body>
${c}
${u}
</body>
</html>`}async function D(i,a,e){let t=/(<img[^>]*\ssrc=")([^"]+)("[^>]*>)/g,o=[],n;for(;(n=t.exec(a))!==null;){let s=n[2];if(!(s.startsWith("data:")||s.startsWith("http://")||s.startsWith("https://")))try{let d=N(i,s,e),c=i.vault.getAbstractFileByPath(d);if(c&&c instanceof p.TFile){let u=await i.vault.readBinary(c),h=c.extension.toLowerCase(),b=B(h),v=L(u),x=`data:${b};base64,${v}`;o.push({original:n[0],replacement:`${n[1]}${x}${n[3]}`})}}catch(d){}}let r=a;for(let s of o)r=r.replace(s.original,s.replacement);return r}function N(i,a,e){if(i.vault.getAbstractFileByPath(a))return a;let t=decodeURIComponent(a);if(i.vault.getAbstractFileByPath(t))return t;let o=e.includes("/")?e.substring(0,e.lastIndexOf("/")):"",n=o?`${o}/${t}`:t;if(i.vault.getAbstractFileByPath(n))return n;let r=i.metadataCache.getFirstLinkpathDest(t,e);return r?r.path:t}function H(i,a){let e=i.match(/^#\s+(.+)$/m);if(e)return e[1].trim();let t=a.split("/");return t[t.length-1].replace(/\.md$/,"")}function I(i){let a={};for(let e of i.split(`
`)){let t=e.indexOf(":");if(t===-1)continue;let o=e.substring(0,t).trim(),n=e.substring(t+1).trim().replace(/^["']|["']$/g,"");o&&(a[o]=n)}return a}function k(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function B(i){return{png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",svg:"image/svg+xml",webp:"image/webp",bmp:"image/bmp"}[i]||"application/octet-stream"}function L(i){let a=new Uint8Array(i),e="";for(let t=0;t<a.byteLength;t++)e+=String.fromCharCode(a[t]);return btoa(e)}var f=class extends l.Plugin{constructor(){super(...arguments);this.settings=w}async onload(){await this.loadSettings(),this.addCommand({id:"export-note",name:"Export current note",checkCallback:e=>{let t=this.app.workspace.getActiveFile();return!t||t.extension!=="md"?!1:(e||this.exportNote(t,this.settings.defaultFormat),!0)}}),this.addCommand({id:"export-html",name:"Export as HTML",checkCallback:e=>{let t=this.app.workspace.getActiveFile();return!t||t.extension!=="md"?!1:(e||this.exportNote(t,"html"),!0)}}),this.addCommand({id:"export-pdf",name:"Export as PDF (print)",checkCallback:e=>{let t=this.app.workspace.getActiveFile();return!t||t.extension!=="md"?!1:(e||this.exportNote(t,"pdf"),!0)}}),this.registerEvent(this.app.workspace.on("file-menu",(e,t)=>{t instanceof l.TFile&&t.extension==="md"&&(e.addItem(o=>{o.setTitle("Export as HTML").setIcon("file-output").onClick(()=>this.exportNote(t,"html"))}),e.addItem(o=>{o.setTitle("Export as PDF").setIcon("printer").onClick(()=>this.exportNote(t,"pdf"))}))})),this.addSettingTab(new g(this.app,this))}async loadSettings(){this.settings=Object.assign({},w,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}async exportNote(e,t){let o=new l.Notice("Exporting...",0);try{let n=await this.app.vault.read(e),r=await C(this.app,n,e.path,this.settings);t==="html"?(await this.saveHtml(e,r),o.hide(),new l.Notice(`Exported ${e.basename}.html`,4e3)):(o.hide(),this.openPrintPreview(e.basename,r))}catch(n){o.hide();let r=n instanceof Error?n.message:String(n);new l.Notice(`Export failed: ${r}`,8e3),console.error("md-export: export error",n)}}async saveHtml(e,t){var d,c;let o=(c=(d=e.parent)==null?void 0:d.path)!=null?c:"",n=`${e.basename}.html`,r=o?`${o}/${n}`:n,s=this.app.vault.getAbstractFileByPath(r);s instanceof l.TFile?await this.app.vault.modify(s,t):await this.app.vault.create(r,t)}openPrintPreview(e,t){l.Platform.isMobile?this.mobileExportPdf(e,t):this.desktopPrint(e,t)}async mobileExportPdf(e,t){let o=`_export_${e}.html`,n=this.app.vault.getAbstractFileByPath(o);n instanceof l.TFile?await this.app.vault.modify(n,t):await this.app.vault.create(o,t);let r=this.app.vault.getAbstractFileByPath(o);r instanceof l.TFile&&await this.app.openWithDefaultApp(r.path),new l.Notice("Opened in browser. Use Share or Print to save as PDF, then delete the _export file.",8e3)}desktopPrint(e,t){var r;let o=document.createElement("iframe");o.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;pointer-events:none;z-index:-1;",document.body.appendChild(o);let n=o.contentDocument||((r=o.contentWindow)==null?void 0:r.document);if(!n){document.body.removeChild(o),new l.Notice("Could not create print preview.",5e3);return}n.open(),n.write(t),n.close(),o.contentWindow&&(o.contentWindow.onafterprint=()=>{document.body.removeChild(o)}),setTimeout(()=>{var s;try{(s=o.contentWindow)==null||s.print()}catch(d){document.body.removeChild(o),new l.Notice("Print failed. Try Export as HTML instead.",5e3)}setTimeout(()=>{o.parentNode&&document.body.removeChild(o)},6e4)},300)}};
