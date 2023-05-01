const data = {
	states: require("../model/states.json"),
	setState(data) {
		this.states = data;
	},
};

const funFacts = require("../model/state");

const getAllStates = async (req, res) => {
	for (let i = 0; i < data.states.length; i++) {
		const facts = await funFacts
			.findOne({ stateCode: data.states[i].code })
			.exec();
		if (facts) {
			data.states[i]["funfacts"] = facts.funfacts;
		}
	}
	if (req.query.contig) {
		getContigousStates(req, res);
		return;
	}
	await res.json(data.states);
};

const getContigousStates = (req, res) => {
	let contigousStates = [];
	data.states.forEach((state) => {
		if (req.query.contig === "true") {
			if (state.code !== "AK" && state.code !== "HI") {
				contigousStates.push(state);
			}
		} else {
			if (state.code === "AK" || state.code === "HI") {
				contigousStates.push(state);
			}
		}
	});
	res.json(contigousStates);
};

const getState = async (req, res) => {
	let code = req.params.state;
	const state = data.states.find((state) => state.code === code);
	const facts = await funFacts.findOne({ stateCode: code });
	if (facts) {
		state.funfacts = facts.funfacts;
	}
	res.json(state);
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
	res.json(stateWithCapital);
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
	res.json(stateWithNickname);
};

const getPopulation = (req, res) => {
    let stateCode = req.params.state;
	const state = data.states.find((state) => state.code === stateCode);
	const stateWithPopulation = {
		state: String,
		population: String,
	};
	stateWithPopulation.state = state.state;
	stateWithPopulation.population = state.population;
	res.json(stateWithPopulation);
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
	res.json(stateWithAdmission);
};

const insertFunfacts = async (req, res) => {
	const code = req.params.state;
	let facts = req.body.funfact;
	console.log(`${code} \t ${facts}`);
	if (!code || !facts) {
		return res
			.status(400)
			.json({ message: "Code and a fun fact is required" });
	}
	const duplicate = await funFacts.findOne({ stateCode: code }).exec();

	if (duplicate) {
		let oldFacts = duplicate.funfacts;
		oldFacts.push(facts);
		duplicate.funfacts = oldFacts;
		duplicate.save();
	} else {
		try {
			const result = await funFacts.create({
				stateCode: code,
				funfacts: facts,
			});
			console.log(result);
		} catch (error) {
			res.status({ message: error.message });
		}
	}
	res.status(201).json({ success: `Added ${facts} to ${code}` });
};

const getFunfact = async (req, res) => {
	const code = req.params.state;
	let facts = [];
	data.states.forEach((state) => {
		if (state.funfacts && state.code == code) {
			facts = state.funfacts;
		}
	});
	const dbFacts = await funFacts.findOne({ stateCode: code }).exec();
	if (dbFacts) facts = facts.concat(dbFacts.funfacts);
	if (facts.length != 0) {
		const randomFact = {
			funfact: facts[Math.floor(Math.random() * facts.length)],
		};
		return res.json(randomFact);
	}
	return res.json({ message: "No funfacts for the state" });
};

const updateFunfact = async (req, res) => {
	let index = req.body.index;
	const funfact = req.body.funfact;
	if (!index || !funfact) {
		res.status(400).json({
			message: "Index parameter and funfact parameter are required",
		});
	}
	index--;
	const code = req.params.state;
	const state = await funFacts.findOne({ stateCode: code });
	if (!state) {
		res.status(400).json({ message: `State ${code} was not found` });
	}
	if (index < state.funfacts.length && index >= 0) {
		state.funfacts[index] = funfact;
		const result = await state.save();
		res.json(result);
	} else {
		res.status(400).json({ message: `${index++} was out of range` });
	}
};

const deleteFunfact = async (req, res) => {
	let index = req.body.index;
	if (!index) {
		res.status(400).json({ message: "Index parameter is required" });
	}
	index--;
	const code = req.params.state;
	const state = await funFacts.findOne({ stateCode: code });
	if (!state) {
		res.status(400).json({ message: `State ${code} was not found` });
	}
	if (index < state.funfacts.length && index >= 0) {
		const fact = state.funfacts.splice(index, 1);
		state.save();
		res.json(`Fact ${fact} was deleted`);
	} else {
		res.status(400).json({ message: `${index++} was out of range` });
	}
};

module.exports = {
	getAllStates,
	getState,
	getCaptial,
	getAdmission,
	getNickname,
	getPopulation,
	insertFunfacts,
	getFunfact,
	deleteFunfact,
	updateFunfact,
};
