const { readFile, writeFile } = require('fs/promises');
const path = require('path');

(async () => {
	const origContents = await readFile(path.join(__dirname, 'original', 'AYeartoLearnJapanese.html'), { encoding: 'utf-8' });
	const origMatches = /<body[^>]*>(.+)<\/body>/m.exec(origContents);
	if ((origMatches ?? []).length < 2) {
		throw new Error('Body not found');
	}

	const origBody = origMatches[1];
	console.log('body', origBody.slice(0, 20));

	const templateContents = await readFile(path.join(__dirname, 'template.html'), { encoding: 'utf-8' });
	const newContents = templateContents.replace('${originalBody}', origBody);
	await writeFile(path.join(__dirname, 'dist', 'index.html'), newContents);
})();