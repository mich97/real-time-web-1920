const fetch = require("node-fetch");
const md5 = require('md5');
const timestamp = Date.now();
const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;
const hash = md5(timestamp + privateKey + publicKey);

exports.getCard = async function() {
	const comics = [375, 10, 264, 21, 114, 229, 37, 342, 45, 48];
	const randomComic = comics[Math.floor(Math.random() * comics.length)];
	const fetchUrl = `http://gateway.marvel.com/v1/public/comics/${randomComic}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

	return await fetch(fetchUrl)
		.then(res => {
			return res.json();
		})
		.then(data => {
			const detail = data.data.results[0];
			const url = `${detail.thumbnail.path}.${detail.thumbnail.extension}`;
			const points = getPoints();
			return { image: url, points: points };
		});
};

exports.getResult = (players, cards) => {
	const points = cards[cards.length - 1].points;
	const answers = players.map(player => player.bid);
	const tie = Object.is(answers[0], answers[1]);

	if (tie) {
		return players;
	} else {
		const winner = players.reduce((max, game) =>
			max.bid > game.bid ? max : game
		);
		winner.game += points;
		return players;
	}
};

exports.getEndResult = players => {
	const points = players.map(player => player.game);
	const tie = Object.is(points[0], points[1]);
	if (tie) {
		return players;
	} else {
		const finalWinner = players.reduce((prev, current) => {
			return prev.game > current.game ? prev : current;
		});
		return finalWinner;
	}
};

exports.getFellowPlayers = (user, allRooms) => {
	for (rooms in allRooms) {
		if (allRooms[rooms][user.roomId]) {
			return allRooms[rooms][user.roomId];
		}
	}
};

function getPoints() {
	const min = 10;
	const max = 100;
	const points = Math.floor(Math.random() * (max - min + 1) + min);
	return points;
}
