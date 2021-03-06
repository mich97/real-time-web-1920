exports.routes = app => {
	app.get("/", (req, res) => {
		res.render("../views/pages/index.ejs");
	});

	app.use("/login", (req, res) => {
		req.session.user = {
			username: req.query.username
		};

		res.render("../views/pages/join-room.ejs");
	});

	app.use("/join-room", (req, res) => {
		req.session.user.roomId = req.query.roomId;
		console.log(req.session);
		res.redirect("/game");
	});

	app.use("/game", (req, res) => {
		const user = req.session.user;
		res.render("../views/pages/game.ejs", {
			username: user.username,
			roomId: user.roomId
		});
	});

	app.use("/logout", (req, res) => {
		delete req.session.user;
		res.redirect("/");
	});
};
