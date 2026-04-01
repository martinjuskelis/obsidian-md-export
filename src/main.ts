import { Notice, Platform, Plugin, TFile } from "obsidian";
import {
	DEFAULT_SETTINGS,
	MdExportSettingTab,
	type MdExportSettings,
} from "./settings";
import { renderNoteToHtml } from "./exporter";

export default class MdExportPlugin extends Plugin {
	settings: MdExportSettings = DEFAULT_SETTINGS;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "export-note",
			name: "Export current note",
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (!file || file.extension !== "md") return false;
				if (!checking) this.exportNote(file, this.settings.defaultFormat);
				return true;
			},
		});

		this.addCommand({
			id: "export-html",
			name: "Export as HTML",
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (!file || file.extension !== "md") return false;
				if (!checking) this.exportNote(file, "html");
				return true;
			},
		});

		this.addCommand({
			id: "export-pdf",
			name: "Export as PDF (print)",
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (!file || file.extension !== "md") return false;
				if (!checking) this.exportNote(file, "pdf");
				return true;
			},
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, abstractFile) => {
				if (!(abstractFile instanceof TFile)) return;
				if (abstractFile.extension !== "md") return;
				menu.addItem((item) => {
					item.setTitle("Export as HTML")
						.setIcon("file-output")
						.onClick(() => this.exportNote(abstractFile, "html"));
				});
				menu.addItem((item) => {
					item.setTitle("Export as PDF")
						.setIcon("printer")
						.onClick(() => this.exportNote(abstractFile, "pdf"));
				});
			})
		);

		this.addSettingTab(new MdExportSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private exporting = false;

	private async exportNote(file: TFile, format: "html" | "pdf") {
		if (this.exporting) {
			new Notice("An export is already in progress.");
			return;
		}
		this.exporting = true;

		const progressNotice = new Notice("Exporting...", 0);

		try {
			const markdown = await this.app.vault.cachedRead(file);
			const html = await renderNoteToHtml(
				this.app,
				markdown,
				file.path,
				this.settings
			);

			if (format === "html") {
				await this.saveHtml(file, html);
				progressNotice.hide();
				new Notice(`Exported ${file.basename}.html`, 4000);
			} else {
				progressNotice.hide();
				this.openPrintPreview(file.basename, html);
			}
		} catch (err) {
			progressNotice.hide();
			const msg = err instanceof Error ? err.message : String(err);
			new Notice(`Export failed: ${msg}`, 8000);
			console.error("md-export: export error", err);
		} finally {
			this.exporting = false;
		}
	}

	private async saveHtml(sourceFile: TFile, html: string) {
		const parentPath = sourceFile.parent?.path ?? "";
		const htmlFilename = `${sourceFile.basename}.html`;
		const htmlPath = parentPath
			? `${parentPath}/${htmlFilename}`
			: htmlFilename;

		const existing = this.app.vault.getAbstractFileByPath(htmlPath);
		if (existing instanceof TFile) {
			await this.app.vault.modify(existing, html);
		} else {
			await this.app.vault.create(htmlPath, html);
		}
	}

	private openPrintPreview(title: string, html: string) {
		if (Platform.isMobile) {
			this.mobileExportPdf(title, html);
		} else {
			this.desktopPrint(title, html);
		}
	}

	private async mobileExportPdf(title: string, html: string) {
		// Sanitize filename for safety
		const safeName = title.replace(/[\\/:*?"<>|]/g, "_").substring(0, 80);
		const tempPath = `_export_${safeName}.html`;

		const existing = this.app.vault.getAbstractFileByPath(tempPath);
		if (existing instanceof TFile) {
			await this.app.vault.modify(existing, html);
		} else {
			await this.app.vault.create(tempPath, html);
		}

		const file = this.app.vault.getAbstractFileByPath(tempPath);
		if (file instanceof TFile) {
			if (typeof (this.app as any).openWithDefaultApp === "function") {
				await (this.app as any).openWithDefaultApp(file.path);
			} else {
				new Notice("Could not open file. Try Export as HTML instead.", 6000);
				return;
			}
		}

		new Notice(
			"Opened in browser. Use Share or Print to save as PDF, then delete the _export file.",
			8000
		);
	}

	private desktopPrint(title: string, html: string) {
		const iframe = document.createElement("iframe");
		iframe.style.cssText =
			"position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;pointer-events:none;z-index:-1;";
		document.body.appendChild(iframe);

		const iframeDoc =
			iframe.contentDocument || iframe.contentWindow?.document;
		if (!iframeDoc) {
			document.body.removeChild(iframe);
			new Notice("Could not create print preview.", 5000);
			return;
		}

		iframeDoc.open();
		iframeDoc.write(html);
		iframeDoc.close();

		if (iframe.contentWindow) {
			iframe.contentWindow.onafterprint = () => {
				if (iframe.parentNode) document.body.removeChild(iframe);
			};
		}

		setTimeout(() => {
			try {
				iframe.contentWindow?.print();
			} catch {
				if (iframe.parentNode) document.body.removeChild(iframe);
				new Notice("Print failed. Try Export as HTML instead.", 5000);
			}
			// Clean up if onafterprint didn't fire
			setTimeout(() => {
				if (iframe.parentNode) document.body.removeChild(iframe);
			}, 60000);
		}, 300);
	}
}
