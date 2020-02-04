import * as vscode from 'vscode';
import { FileSystemProvider } from './FileSystemProvider';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "tree-view-test" is now active!');

	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);

	let rootPath: string | undefined = vscode.workspace.rootPath;

	if (rootPath) {
		vscode.window.registerTreeDataProvider('fileSystem', new FileSystemProvider(rootPath));
	}
}

// this method is called when your extension is deactivated
export function deactivate() { }