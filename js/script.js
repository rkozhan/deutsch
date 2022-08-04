"use strict";
document.addEventListener('DOMContentLoaded', () => {
	///////////////////////////Array Names
	//  M / F / N                        NOUNS maskuline/feminine/neutral
	//  R / U                            VERBS
	//regelmässige Verben - правильные
	//unregelmässige Verben - неправильные:
	// Сильные,
	// Слабые:(при спряжении в ед.ч. 2 и 3 лица
	// AU,A -> умляут,
	// E -> ie, i )
	const words = [];



	//------------------------------------------------------knownWords
	let knownWords = [];
	let word = null,
		currentWord;


	//----------------------------------------next word
	function nextWord(arr) {
		if (arr.length > knownWords.length) {
			let i = getR(0, arr.length - 1);
			if (currentWord != i && !knownWords.includes(i)) {
				word = arr[i];
				currentWord = i;
			} else {
				l('else');
				nextWord(arr);
			}

		} else {
			l('all words are added to known');
			//modal window
		}
	}


	//------------------------------------------Local Storage
	function getStorage() {
		if (localStorage.getItem('memory')) {
			knownWords = (localStorage.getItem('memory'));
		}
	}
	function setStorage(memory) {
		localStorage.setItem('memory', memory);
	}
	getStorage();
	l(knownWords);

	//------------------------------------------UI
	//------------------------------------------CLICK
	const btnTranslate = document.querySelector('.btn_translate');

	document.addEventListener('click', (e) => {
		if (!e.target.parentElement.classList.contains('disable')) {
			if (e.target.closest('#btn-next')) {
				l('Next slide');
				showNextSlide();

			} else if (e.target.closest('#btn-known')) {
				l('add to known');
				/*
				knownWords.push(wordIndex);
				setStorage(knownWords);
				nextWord(index);
				setTimeout(hideTranslation, 500);
		*/
			} else if (e.target.closest('#btn-transl')) {
				const card = document.querySelector('.active-slide .card2');
				card.classList.toggle('active');
			} else if (e.target.closest('#btn-info')) {
				const card = document.querySelector('.active-slide .card3');
				card.classList.toggle('active');
			};
		} else l('disable');
	});

	function hideTranslation() {
		field.classList.remove('rotate');
		btnTranslate.classList.remove('active');
	}

	function showNextSlide() {
		const nextSlide = document.querySelector('.next-slide');
		const activeSlide = document.querySelector('.active-slide');
		if (nextSlide) {
			nextSlide.classList.remove('next-slide');
			nextSlide.classList.add('active-slide');
			if (activeSlide) {
				activeSlide.classList.remove('active-slide');
				setTimeout(() => {
					activeSlide.remove();
				}, 500);
			}
			nextWord(words);
			new NewSlide(word).render();
		}
	}
	const slider = document.querySelector('.slider__container');

	class NewSlide {
		constructor(word) {
			this.word = word[0];
			this.type = word[1][0];
			this.sex = this.selectSex();
			this.sexColor = this.selectColor();
			this.eng = word[1][1];
			this.rus = word[1][2];
			this.info = this.selectInfo();
			this.color = `rgb(${getR(50, 155)},${getR(50, 155)},${getR(50, 155)})`;
		}
		render() {
			const element = document.createElement('div');
			element.innerHTML = `<div class="slide__inner">
		<div style="background-color: ${this.color}" class="slide__item active card1"><p>${this.word}<p/></div>
		<div class="slide__item card2"${this.sexColor}><p>${this.sex}${this.word}</p><p>${this.info}</p><p>${this.rus}</p><p>${this.eng}</p></div>
		<div class="slide__item card3"></div>
		</div>`;
			element.classList.add('slide', 'next-slide');
			slider.append(element);
		}
		selectSex(x = this.type) {
			const sexes = {
				"m": "der ",
				"f": "die ",
				"n": "das "
			};
			return sexes[x] ?? "";
		}
		selectColor(y = this.type) {
			const colors = {
				"m": " style='background-color: royalblue'",
				"f": " style='background-color: indianred'",
				"n": " style='background-color: peru'"
			};
			return colors[y] ?? "";
		}
		selectInfo(i = word[1][3]) {
			let info = `<p>${i}</p>`;
			if (this.sex) info = `<p style="color: springgreen">die ${i}</p>`;
			if (word[1][4]) info = `<p>(${i}, ${word[1][4]})</p>`;
			return info;
		}
	}







	//--------------------------------------------------database
	const getDataBase = async (url) => {
		const resp = await fetch(url);
		if (!resp.ok) {
			throw new Error(`error: status${resp.status} `);
		}
		return await resp.json();
	};

	//------------------------------------------------------sources
	const sourses = [
		'db/verbs.json', //verbs
		'db/subs.json' //Substantiv
	];

	sourses.forEach(source => {
		getDataBase(source)
			.then(data => {
				Object.entries(data).forEach((key) => {
					const arr = [];
					let s = key[1].split(" ");
					arr.push(key[0], s);
					words.push(arr);
				});
			});
	});

	console.log(words);
	//------------------------------------------INIT

	setTimeout(() => {
		nextWord(words);

		new NewSlide(word).render();
		setTimeout(showNextSlide, 0);
	}, 2000);


	/// -------------------------------------------------get Random
	function getR(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
	}

}); //---------------------------------------------------end domContentLoaded



function l(arg) {
	console.log(arg);
}






