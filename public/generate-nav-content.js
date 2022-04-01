// Parse sections from document
const sections = [];
const hiCollection = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
const maxTitleLength = 72;

for (const h of hiCollection) {
	if (h.textContent.trim().length === 0) {
		continue;
	}
	let hNum = Number(h.tagName[1]);

	let title = h.textContent.trim();
	if (title.length > maxTitleLength) {
		title = title.slice(0, maxTitleLength - 3) + '...';
	}

	// Special case handling for incorrectly nested topics
	if (title.startsWith('On when to learn the kanji')) {
		hNum += 3;
	} else if (title.startsWith('Level I') || title.startsWith('A Mnemonic and its Journey') || title.startsWith('On Learning Kanji and Vocab') || title.startsWith('Stage 0: Getting set up')) {
		hNum += 1;
	}

	const section = { title, subsections: [], level: hNum, scrollTarget: h };
	let destination = sections;

	while (destination.length > 0 && hNum > destination[destination.length - 1].level) {
		destination = destination[destination.length - 1].subsections;
	}

	destination.push(section);
}

// Add section links to navbar
const rootUl = document.getElementById('rootNavList');
const allChildUls = [];

const generateNavItem = (section, ul) => {
	const li = document.createElement('li');
	const span = document.createElement('span');
	span.innerText = section.title;
	li.appendChild(span);
	ul.appendChild(li);

	li.onclick = evt => {
		section.scrollTarget.scrollIntoView();
		evt.stopPropagation();
	}

	if (section.subsections.length > 0) {
		const collapseButton = document.createElement('button');
		li.prepend(collapseButton);
		collapseButton.innerText = '+';
		collapseButton.classList.add('collapse-button');

		const childUl = document.createElement('ul');
		li.appendChild(childUl);
		childUl.hidden = true;
		allChildUls.push(childUl);

		collapseButton.onclick = (evt) => {
			childUl.hidden = !childUl.hidden;
			collapseButton.innerText = childUl.hidden ? '+' : '-';
			setCollapseAllButtonText();
			evt.stopPropagation();
		}

		section.subsections.forEach(sec => generateNavItem(sec, childUl));
	}
}

sections.forEach(sec => generateNavItem(sec, rootUl));

const shouldHide = () => {
	return allChildUls.find(x => !x.hidden);
}

// Toggles all uls either on or off. On if all are off, off if any are on.
document.getElementById('collapseAll').onclick = () => {
	const hide = shouldHide();
	for (const ul of allChildUls) {
		ul.hidden = hide;
		setCollapseAllButtonText();
	}
}

const setCollapseAllButtonText = () => {
	document.getElementById('collapseAll').innerText = shouldHide() ? 'Collapse All' : 'Expand All';
}
setCollapseAllButtonText();

// Remove Google external link warning from links
const links = document.getElementsByTagName('a');
const prefix = 'https://www.google.com/url?q=';
for (const link of links) {
	if (link.href.startsWith(prefix)) {
		// Strip prefix and replace first ampersand with question mark
		link.href = link.href.slice(prefix.length).replace('&', '?');
	}
}
