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
		if (Platform.isMobile) {
			// On mobile, save a temp HTML file and open with default app
			this.mobilePrint(title, html);
		} else {
			// On desktop, open a print-ready window
			this.desktopPrint(title, html);
		}
	}

	private async mobilePrint(title: string, html: string) {
		// Save to a temporary HTML file the user can open in their browser
		const tempPath = `_export_${title}.html`;

		const existing = this.app.vault.getAbstractFileByPath(tempPath);
		if (existing instanceof TFile) {
			await this.app.vault.modify(existing, html);
		} else {
			await this.app.vault.create(tempPath, html);
		}

		// Open with the system default browser
		const file = this.app.vault.getAbstractFileByPath(tempPath);
		if (file instanceof TFile) {
			await (this.app as any).openWithDefaultApp(file.path);
		}

		new Notice(
			"Opened in browser. Use your browser's Share or Print menu to save as PDF. You can delete the temporary HTML file afterwards.",
			10000
		);
	}

	private desktopPrint(title: string, html: string) {
		// Open a new browser window with the content and trigger print
		const printWindow = window.open("", "_blank");
		if (!printWindow) {
			new Notice(
				"Could not open print window. Your browser may be blocking pop-ups.",
				6000
			);
			return;
		}
		printWindow.document.write(html);
		printWindow.document.close();
		printWindow.document.title = title;

		// Wait for content to render before printing
		printWindow.onload = () => {
			printWindow.print();
		};
		// Fallback if onload doesn't fire
		setTimeout(() => {
			printWindow.print();
		}, 500);
	}
}
