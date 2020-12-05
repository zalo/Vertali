import * as vscode from 'vscode';

function charIsSpecialCharacter(char: string): boolean {
	let specialCharacters = "{}[]!@#$%^&*(),.<>/?':;|\\+=-_`~";
	for (let c = 0; c < specialCharacters.length; c++){
		if (specialCharacters[c] === char) { return true; }
	}
	return false;
}

function AlignAToB(A: string, B: string): string {
	let aLength = A.length;//, bLength = B.length;
	for (let outInd = 0; outInd < aLength; outInd++){
		// Continue if they already match or not a special character
		if (A[outInd] === B[outInd] || !charIsSpecialCharacter(A[outInd])) { continue; }

		//Iterate through the reference string until we find a match
		for (let refInd = outInd; refInd < B.length; refInd++) {
			if (A[outInd] === B[refInd]) {
				// Match Found! Now to insert the appropriate number of spaces
				let temp = A.slice(0, outInd);
				for (let diff = 0; diff < refInd - outInd; diff++) { temp += " "; }
				temp    += A.slice(outInd);
				A = temp; outInd = refInd; aLength = A.length;
				break;
			}
		}
	}
	return A;
}

function VerticalAlignTwoLines(
	code: string[], a: number, b: number): void {
	let aLine = code[a];
	let bLine = code[b];

	let AToB = AlignAToB(aLine, bLine);
	let BToA = AlignAToB(bLine, aLine);

	if (AToB.length < BToA.length) {
		code[a] = AToB;
	} else {
		code[b] = BToA;
	}
}

function VerticalAlign(stringToAlign:string) : string {
	let lines = stringToAlign.split("\n");

	for (let iters = 0; iters < 10; iters++) {
		for (let i = 0; i < lines.length - 1; i++) {
			VerticalAlignTwoLines(lines, i, i + 1);
		}
		for (let i = lines.length - 1; i > 1; i--) {
			VerticalAlignTwoLines(lines, i, i - 1);
		}
	}

	let outputCode = "";
	lines.forEach(line => { outputCode += line + "\n"; });
	return outputCode.slice(0, -1);
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
