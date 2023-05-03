const data = {
	states: require("../model/states.json"),
	setState(data) {
		this.states = data;
	},
};

const getCaptial = (req, res) => {
	let stateCode = req.params.state;
	const state = data.states.find((state) => state.code === stateCode);
	const stateWithCapital = {
		state: String,
		capital: String,
	};

	stateWithCapital.state = state.state;
	stateWithCapital.capital = state.capital_city;
	res.status(201).json(stateWithCapital);
};

const getNickname = (req, res) => {
	let stateCode = req.params.state;
	const state = data.states.find((state) => state.code === stateCode);
	const stateWithNickname = {
		state: String,
		nickname: String,
	};
	stateWithNickname.state = state.state;
	stateWithNickname.nickname = state.nickname;
	res.status(201).json(stateWithNickname);
};

const getPopulation = (req, res) => {
	let stateCode = req.params.state;
	const state = data.states.find((state) => state.code === stateCode);
	const stateWithPopulation = {
		state: String,
		population: String,
	};
	stateWithPopulation.state = state.state;
	let reversePopulation = "",
		population = "";
	const pop = "" + state.population;
	for (let i = 0; i < pop.length; i++) {
		const count = i + 1;
		if (count % 3 === 0 && count != pop.length) {
			reversePopulation =
				reversePopulation + pop.charAt(pop.length - i - 1) + ",";
		} else {
			reversePopulation =
				reversePopulation + pop.charAt(pop.length - i - 1);
		}
	}
	for (let i = reversePopulation.length - 1; i >= 0; i--) {
		population = population + reversePopulation.charAt(i);
	}
	stateWithPopulation.population = population;
	res.status(201).json(stateWithPopulation);
};

const getAdmission = (req, res) => {
	let stateCode = req.params.state;
	const state = data.states.find((state) => state.code === stateCode);
	const stateWithAdmission = {
		state: String,
		admitted: Date,
	};
	stateWithAdmission.state = state.state;
	stateWithAdmission.admitted = state.admission_date;
	res.status(201).json(stateWithAdmission);
};

module.exports = { getAdmission, getCaptial, getNickname, getPopulation };
