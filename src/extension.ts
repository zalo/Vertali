import * as vscode from 'vscode';

function charIsSpecialCharacter(char: string): boolean {
	let specialCharacters = "{}[]!@#$%^&*(),.<>/?':;|\\+=-_`~";
	for (let c = 0; c < specialCharacters.length; c++){
		if (specialCharacters[c] === char) { return true; }
	}
	return false;
}

function VerticalAlignTwoLines(
	code: string[], referenceLine: number, toModify: number): void {
	let refLine = code[toModify];
	let outLine = code[referenceLine];

	for (let outInd = 0; outInd < refLine.length; outInd++){
		// Continue if they already match or not a special character
		if (outLine[outInd] === refLine[outInd] || !charIsSpecialCharacter(outLine[outInd])) { continue; }

		//Iterate through the reference string until we find a match
		for (let refInd = outInd; refInd < outLine.length; refInd++) {
			if (outLine[outInd] === refLine[refInd]) {
				// Match Found! Now to insert the appropriate number of spaces
				code[referenceLine] = outLine.slice(0, outInd);
				for (let diff = 0; diff < refInd - outInd; diff++) { code[referenceLine] += " "; }
				code[referenceLine] += outLine.slice(outInd, -1);
				outLine = code[referenceLine];
				outInd = refInd;
			}

		}
	}
}

function VerticalAlign(stringToAlign:string) : string {
	let lines = stringToAlign.split("\n");

	for (let iters = 0; iters < 1; iters++) {
		for (let i = 0; i < lines.length - 1; i++) {
			VerticalAlignTwoLines(lines, i, i + 1);
		}
		for (let i = lines.length - 1; i > 1; i--) {
			VerticalAlignTwoLines(lines, i, i - 1);
		}
	}

	let outputCode = "";
	//for (let i = 0; i < lines.length; i++){ outputCode += lines[i] + "\n";}
	lines.forEach(line => { outputCode += line + "\n"; });
	return outputCode;
}

export function activate(context: vscode.ExtensionContext) {
	// Register the Right Click Menu Actions ------------------------------------
	let format = vscode.commands.registerCommand('vertali.Format', () => {
		let editor = vscode.window.activeTextEditor;
		if(editor){
			editor.edit(builder => {
				if (editor) {
					builder.replace(editor.selection,
						VerticalAlign(editor.document.getText(editor.selection)));
				}
			});
		}
	});
	context.subscriptions.push(format);
}

export function deactivate() {}
