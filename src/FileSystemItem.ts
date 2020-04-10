import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class FileSystemItem extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly fullPath: string,
		public readonly command?: vscode.Command
	) {
		super(label, vscode.TreeItemCollapsibleState.Collapsed);

		if (fs.lstatSync(fullPath).isDirectory()) {
			this.contextValue = "folder";
		} else {
			this.contextValue = "document";
			this.collapsibleState = vscode.TreeItemCollapsibleState.None;
		}

		this.iconPath = {
			light: path.join(__filename, '..', '..', 'resources', 'light', `${this.contextValue}.svg`),
			dark: path.join(__filename, '..', '..', 'resources', 'dark', `${this.contextValue}.svg`)
		};
	}
}