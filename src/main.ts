import { Modal, Notice, Platform, Plugin, TFile } from "obsidian";
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

	private async exportNote(file: TFile, format: "html" | "pdf") {
		const progressNotice = new Notice("Exporting...", 0);

		try {
			const markdown = await this.app.vault.read(file);
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
		// Use an iframe to trigger the native print dialog directly
		// — works on both mobile and desktop without opening a browser.
		// On Android/iOS the print dialog includes "Save as PDF".
		const iframe = document.createElement("iframe");
		iframe.style.cssText =
			"position:fixed;top:0;left:0;width:100%;height:100%;opacity:0;pointer-events:none;z-index:-1;";
		document.body.appendChild(iframe);

		const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
		if (!iframeDoc) {
			document.body.removeChild(iframe);
			// Fallback: save HTML and open externally
			this.fallbackPrint(title, html);
			return;
		}

		iframeDoc.open();
		iframeDoc.write(html);
		iframeDoc.close();

		// Wait for content (especially images) to render before printing
		const triggerPrint = () => {
			try {
				iframe.contentWindow?.print();
			} catch {
				// If iframe print fails (some mobile browsers), fall back
				document.body.removeChild(iframe);
				this.fallbackPrint(title, html);
				return;
			}
			// Clean up after a delay to allow the print dialog to appear
			setTimeout(() => {
				document.body.removeChild(iframe);
			}, 1000);
		};

		// Give the iframe time to render images and styles
		if (iframe.contentWindow) {
			iframe.contentWindow.onafterprint = () => {
				document.body.removeChild(iframe);
			};
		}
		setTimeout(triggerPrint, 300);
	}

	private async fallbackPrint(title: string, html: string) {
		// Fallback for environments where iframe printing doesn't work:
		// save an HTML file and open it with the system default app.
		const tempPath = `_export_${title}.html`;

		const existing = this.app.vault.getAbstractFileByPath(tempPath);
		if (existing instanceof TFile) {
			await this.app.vault.modify(existing, html);
		} else {
			await this.app.vault.create(tempPath, html);
		}

		const file = this.app.vault.getAbstractFileByPath(tempPath);
		if (file instanceof TFile) {
			await (this.app as any).openWithDefaultApp(file.path);
		}

		new Notice(
			"Opened in browser — use Share/Print to save as PDF. You can delete the temporary HTML file afterwards.",
			8000
		);
	}
}
