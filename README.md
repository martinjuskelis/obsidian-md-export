# Markdown Export

An Obsidian plugin that exports your notes to HTML and PDF. Designed to work on **mobile** (Android/iOS) where most export plugins don't.

## Features

- **Export as HTML** — saves a self-contained `.html` file with embedded images (base64) next to your note
- **Export as PDF** — opens the rendered note for printing/saving as PDF
  - **Desktop:** triggers the print dialog directly via iframe
  - **Mobile:** opens the HTML in your system browser where you can use Share/Print → Save as PDF
- Uses Obsidian's own renderer — supports callouts, wikilinks, embeds, math, code highlighting, task lists, and more
- Clean, readable stylesheet with print-optimized CSS
- Optional frontmatter display as a metadata table
- Custom CSS support

## Usage

1. Open a Markdown note
2. Use the command palette: **Export as HTML** or **Export as PDF (print)**
3. Or right-click the file in the sidebar for the same options

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Default format | Format used by the generic "Export" command | HTML |
| Include frontmatter | Show YAML frontmatter as a table in the export | Off |
| Custom CSS | Additional CSS injected into exported files | _(empty)_ |

## Installation (BRAT)

1. Install the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin
2. Add this repo: `martinjuskelis/obsidian-md-export`
3. Enable the plugin in Settings → Community Plugins
