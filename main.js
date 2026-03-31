var P=Object.create;var c=Object.defineProperty;var T=Object.getOwnPropertyDescriptor;var E=Object.getOwnPropertyNames;var A=Object.getPrototypeOf,$=Object.prototype.hasOwnProperty;var M=(r,i)=>{for(var t in i)c(r,t,{get:i[t],enumerable:!0})},S=(r,i,t,e)=>{if(i&&typeof i=="object"||typeof i=="function")for(let n of E(i))!$.call(r,n)&&n!==t&&c(r,n,{get:()=>i[n],enumerable:!(e=T(i,n))||e.enumerable});return r};var D=(r,i,t)=>(t=r!=null?P(A(r)):{},S(i||!r||!r.__esModule?c(t,"default",{value:r,enumerable:!0}):t,r)),N=r=>S(c({},"__esModule",{value:!0}),r);var U={};M(U,{default:()=>f});module.exports=N(U);var s=require("obsidian");var m=require("obsidian"),y={includeFrontmatter:!1,defaultFormat:"html",customCss:""},g=class extends m.PluginSettingTab{constructor(i,t){super(i,t),this.plugin=t}display(){let{containerEl:i}=this;i.empty(),new m.Setting(i).setName("Default export format").setDesc("Format used by the default export command.").addDropdown(t=>t.addOption("html","HTML").addOption("pdf","PDF (via print)").setValue(this.plugin.settings.defaultFormat).onChange(async e=>{this.plugin.settings.defaultFormat=e,await this.plugin.saveSettings()})),new m.Setting(i).setName("Include frontmatter").setDesc("Include YAML frontmatter as a metadata table in the export.").addToggle(t=>t.setValue(this.plugin.settings.includeFrontmatter).onChange(async e=>{this.plugin.settings.includeFrontmatter=e,await this.plugin.saveSettings()})),new m.Setting(i).setName("Custom CSS").setDesc("Additional CSS to include in exported files.").addTextArea(t=>t.setPlaceholder("body { font-family: serif; }").setValue(this.plugin.settings.customCss).onChange(async e=>{this.plugin.settings.customCss=e,await this.plugin.saveSettings()}))}};var h=require("obsidian"),B=`
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
`;async function C(r,i,t,e){let n=i,a=null,o=i.match(/^---\n([\s\S]*?)\n---\n/);o&&(n=i.substring(o[0].length),e.includeFrontmatter&&(a=O(o[1])));let l=document.createElement("div"),p=new h.Component;p.load();try{await h.MarkdownRenderer.render(r,n,l,t,p)}finally{p.unload()}let d="";a&&Object.keys(a).length>0&&(d=`<table class="frontmatter-table"><tbody>${Object.entries(a).map(([w,k])=>`<tr><th>${v(w)}</th><td>${v(k)}</td></tr>`).join(`
`)}</tbody></table>`);let u=await H(r,l.innerHTML,t),b=L(n,t),x=e.customCss?`
${e.customCss}
`:"";return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${v(b)}</title>
<style>${B}${x}</style>
</head>
<body>
${d}
${u}
</body>
</html>`}async function H(r,i,t){let e=/(<img[^>]*\ssrc=")([^"]+)("[^>]*>)/g,n=[],a;for(;(a=e.exec(i))!==null;){let l=a[2];if(!(l.startsWith("data:")||l.startsWith("http://")||l.startsWith("https://")))try{let p=I(r,l,t),d=r.vault.getAbstractFileByPath(p);if(d&&d instanceof(await import("obsidian")).TFile){let u=await r.vault.readBinary(d),b=d.extension.toLowerCase(),x=j(b),F=R(u),w=`data:${x};base64,${F}`;n.push({original:a[0],replacement:`${a[1]}${w}${a[3]}`})}}catch(p){}}let o=i;for(let l of n)o=o.replace(l.original,l.replacement);return o}function I(r,i,t){if(r.vault.getAbstractFileByPath(i))return i;let e=decodeURIComponent(i);if(r.vault.getAbstractFileByPath(e))return e;let n=t.includes("/")?t.substring(0,t.lastIndexOf("/")):"",a=n?`${n}/${e}`:e;if(r.vault.getAbstractFileByPath(a))return a;let o=r.metadataCache.getFirstLinkpathDest(e,t);return o?o.path:e}function L(r,i){let t=r.match(/^#\s+(.+)$/m);if(t)return t[1].trim();let e=i.split("/");return e[e.length-1].replace(/\.md$/,"")}function O(r){let i={};for(let t of r.split(`
`)){let e=t.indexOf(":");if(e===-1)continue;let n=t.substring(0,e).trim(),a=t.substring(e+1).trim().replace(/^["']|["']$/g,"");n&&(i[n]=a)}return i}function v(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function j(r){return{png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",svg:"image/svg+xml",webp:"image/webp",bmp:"image/bmp"}[r]||"application/octet-stream"}function R(r){let i=new Uint8Array(r),t="";for(let e=0;e<i.byteLength;e++)t+=String.fromCharCode(i[e]);return btoa(t)}var f=class extends s.Plugin{constructor(){super(...arguments);this.settings=y}async onload(){await this.loadSettings(),this.addCommand({id:"export-note",name:"Export current note",checkCallback:t=>{let e=this.app.workspace.getActiveFile();return!e||e.extension!=="md"?!1:(t||this.exportNote(e,this.settings.defaultFormat),!0)}}),this.addCommand({id:"export-html",name:"Export as HTML",checkCallback:t=>{let e=this.app.workspace.getActiveFile();return!e||e.extension!=="md"?!1:(t||this.exportNote(e,"html"),!0)}}),this.addCommand({id:"export-pdf",name:"Export as PDF (print)",checkCallback:t=>{let e=this.app.workspace.getActiveFile();return!e||e.extension!=="md"?!1:(t||this.exportNote(e,"pdf"),!0)}}),this.registerEvent(this.app.workspace.on("file-menu",(t,e)=>{e instanceof s.TFile&&e.extension==="md"&&(t.addItem(n=>{n.setTitle("Export as HTML").setIcon("file-output").onClick(()=>this.exportNote(e,"html"))}),t.addItem(n=>{n.setTitle("Export as PDF").setIcon("printer").onClick(()=>this.exportNote(e,"pdf"))}))})),this.addSettingTab(new g(this.app,this))}async loadSettings(){this.settings=Object.assign({},y,await this.loadData())}async saveSettings(){await this.saveData(this.settings)}async exportNote(t,e){let n=new s.Notice("Exporting...",0);try{let a=await this.app.vault.read(t),o=await C(this.app,a,t.path,this.settings);e==="html"?(await this.saveHtml(t,o),n.hide(),new s.Notice(`Exported ${t.basename}.html`,4e3)):(n.hide(),this.openPrintPreview(t.basename,o))}catch(a){n.hide();let o=a instanceof Error?a.message:String(a);new s.Notice(`Export failed: ${o}`,8e3),console.error("md-export: export error",a)}}async saveHtml(t,e){var p,d;let n=(d=(p=t.parent)==null?void 0:p.path)!=null?d:"",a=`${t.basename}.html`,o=n?`${n}/${a}`:a,l=this.app.vault.getAbstractFileByPath(o);l instanceof s.TFile?await this.app.vault.modify(l,e):await this.app.vault.create(o,e)}openPrintPreview(t,e){s.Platform.isMobile?this.mobilePrint(t,e):this.desktopPrint(t,e)}async mobilePrint(t,e){let n=`_export_${t}.html`,a=this.app.vault.getAbstractFileByPath(n);a instanceof s.TFile?await this.app.vault.modify(a,e):await this.app.vault.create(n,e);let o=this.app.vault.getAbstractFileByPath(n);o instanceof s.TFile&&await this.app.openWithDefaultApp(o.path),new s.Notice("Opened in browser. Use your browser's Share or Print menu to save as PDF. You can delete the temporary HTML file afterwards.",1e4)}desktopPrint(t,e){let n=window.open("","_blank");if(!n){new s.Notice("Could not open print window. Your browser may be blocking pop-ups.",6e3);return}n.document.write(e),n.document.close(),n.document.title=t,n.onload=()=>{n.print()},setTimeout(()=>{n.print()},500)}};
