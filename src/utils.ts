import * as vscode from 'vscode';

export function getCurrentLanguage() {
	if(vscode.window.activeTextEditor){
		return vscode.window.activeTextEditor.document.languageId;
	}
	return "";
}

export function replaceAll(input:string, toReplace:string, replace:string) {
	let toReturn = input;
	let oldstring = '';
	while (oldstring !== toReturn){
		oldstring = toReturn+'';
		toReturn = toReturn.replace(toReplace, replace);
	}
	return toReturn;
}

