import { App, PluginSettingTab, Setting } from "obsidian";
import type MdExportPlugin from "./main";

export interface MdExportSettings {
	includeFrontmatter: boolean;
	defaultFormat: "html" | "pdf";
	customCss: string;
}

export const DEFAULT_SETTINGS: MdExportSettings = {
	includeFrontmatter: false,
	defaultFormat: "html",
	customCss: "",
};

export class MdExportSettingTab extends PluginSettingTab {
	plugin: MdExportPlugin;

	constructor(app: App, plugin: MdExportPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Default export format")
			.setDesc("Format used by the default export command.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("html", "HTML")
					.addOption("pdf", "PDF (via print)")
					.setValue(this.plugin.settings.defaultFormat)
					.onChange(async (value) => {
						this.plugin.settings.defaultFormat = value as
							| "html"
							| "pdf";
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Include frontmatter")
			.setDesc("Include YAML frontmatter as a metadata table in the export.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.includeFrontmatter)
					.onChange(async (value) => {
						this.plugin.settings.includeFrontmatter = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Custom CSS")
			.setDesc("Additional CSS to include in exported files.")
			.addTextArea((text) =>
				text
					.setPlaceholder("body { font-family: serif; }")
					.setValue(this.plugin.settings.customCss)
					.onChange(async (value) => {
						this.plugin.settings.customCss = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
