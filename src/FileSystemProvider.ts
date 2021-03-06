import * as vscode from 'vscode';
import * as process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { FileSystemItem } from "./FileSystemItem";

export class FileSystemProvider implements vscode.TreeDataProvider<FileSystemItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<FileSystemItem | undefined>
		= new vscode.EventEmitter<FileSystemItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<FileSystemItem | undefined> = this._onDidChangeTreeData.event;

	constructor() {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: FileSystemItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: FileSystemItem): Promise<FileSystemItem[]> {
		if (element) {
			return Promise.resolve(this.getFileSystemItemsInFolder(element.fullPath));
		}
		else {
			return Promise.resolve(this.getDrives());
		}
	}

	private getDrives(): Promise<FileSystemItem[]> {
		let driveList: string[];

		return new Promise((resolve, reject) => {
			process.exec('wmic logicaldisk get name', (error: any, stdout: string) => {

				driveList = stdout.split('\r\r\n')
					.filter((value: string) => /[A-Za-z]:/.test(value))
					.map((value: string) => value.trim());

				let driveItems: FileSystemItem[] = [];

				driveList.forEach(element => {
					try {
						driveItems.push(new FileSystemItem(element, element + "\\"));
					} catch (error) {
					}
				});

				resolve(driveItems);
			});
		});
	}

	private getFileSystemItemsInFolder(folderPath: string): Promise<FileSystemItem[]> {
		return new Promise((resolve, reject) => {
			let fileSystemItems: FileSystemItem[] = [];

			fs.readdirSync(folderPath).forEach(fileName => {
				try {
					let fullPath = path.join(folderPath, fileName);

					if (fs.existsSync(fullPath)) {
						let fileSystemItem: FileSystemItem = new FileSystemItem(fileName, fullPath);
						fileSystemItems.push(fileSystemItem);
					}
				}
				catch (error) {

				}
			});

			resolve(fileSystemItems);
		});
	}
}