// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

interface RunConfig {
	cmd: string,
	desc: string,
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('runjson.runJSON', () => {
		if (vscode.workspace.workspaceFolders === undefined) {
			return [];
		};
		fs.readFile(	
			vscode.workspace.workspaceFolders[0].uri.path + "/run.json",
			"utf8",
			(err, rawData) => {
				if (err !== null) {
					vscode.window.showErrorMessage("Could not find a run.json in the project root");
					return;
				}

				let data: { [name: string]: RunConfig} = JSON.parse(rawData);
				let picks: vscode.QuickPickItem[] = [];
				Object.keys(data).forEach((configName) => {
					picks.push({
						label: data[configName].desc,
						description: configName,
					});
				});

				vscode.window.showQuickPick(
					picks,
					{
						canPickMany: false,
					}
				).then((pick) => {
					if (pick !== undefined) {
						const terminal = vscode.window.createTerminal({ name: "run.json: " + pick.label, hideFromUser: false });
						terminal.show();
						if (pick.description !== undefined) {
							terminal.sendText(data[pick.description].cmd);
						}
					}
				});
			}
		);
	});

	context.subscriptions.push(disposable);

}

function getCommands(): string[] {
	if (vscode.workspace.workspaceFolders === undefined) {
		return [];
	};

	// vscode.workspace.openTextDocument(vscode.Uri.file("etc/passwd")).then((document) => {
	// 	let text = document.getText();
	// 	console.log(text);
	// });

	let out: string[] = [];

	fs.readFile(	
		vscode.workspace.workspaceFolders[0].uri.path + "/run.json",
		"utf8",
		(err, rawData) => {
			if (err !== null) {
				vscode.window.showErrorMessage("Could not find a run.json in the project root");
				return;
			}

			let data: { [name: string]: RunConfig } = JSON.parse(rawData);
			console.log(Object.keys(data));
			out = Object.keys(data);
		}
	);

	return out;
}

// This method is called when your extension is deactivated
export function deactivate() {}
