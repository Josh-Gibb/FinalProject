const data = {
	states: require("../model/states.json"),
	setState(data) {
		this.states = data;
	},
};

function validateState(req, res, next) {
    const code = req.params.state;
	if (code) {
		const valid = data.states.find(
			(state) => state.code === code.toUpperCase()
		);
		if (!valid) {
			return res.status(401).send({
				message: "Invalid state abbreviation parameter",
			});
		}
        req.params.state = code.toUpperCase();
	}
	next();
}

module.exports = { validateState };
