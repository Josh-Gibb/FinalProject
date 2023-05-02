const data = {
	states: require("../model/states.json"),
	setState(data) {
		this.states = data;
	},
};

const funFacts = require("../model/state");

const populateStatesWithFacts = (pos, facts) => {
	if (facts) {
		if (data.states[pos].funfacts) {
			data.states[pos]["funfacts"] = data.states[pos][
				"funfacts"
			].concat(facts.funfacts);
		} else {
			data.states[pos]["funfacts"] = facts.funfacts;
		}
	}
};

const getAllStates = async (req, res) => {
	for (let i = 0; i < data.states.length; i++) {
		const facts = await funFacts
			.findOne({ stateCode: data.states[i].code })
			.exec();
		populateStatesWithFacts(i, facts);
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
	const pos = getPosition(code);
	const facts = await funFacts.findOne({ stateCode: code });
	populateStatesWithFacts(pos, facts);
	res.json(data.states[pos]);
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
		const db = await duplicate.save();
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

const updateFunfact = async (req, res) => {
	let index = req.body.index;
	const funfact = req.body.funfact;
	if (!index || !funfact) {
		return res.status(400).json({
			message: "Index parameter and funfact parameter are required",
		});
	}
	if (index < 1) {
		return res
			.status(400)
			.json({ message: `${++index} is an invalid index` });
	}
	index--;
	const code = req.params.state;
	const state = await funFacts.findOne({ stateCode: code });
	const pos = getPosition(code);
	const fact = data.states[pos].funfacts;
	if (!fact) {
		await dbData(index, state, funfact);
		return;
	} else {
		const factLength = fact.length - 1;
		if (index > factLength) {
			index = index - factLength;
			await dbData(res, index, state, funfact);
		} else {
			data.states[pos].funfacts[index] = funfact;
			res.json(
				`index ${++index} changed to ${
					data.states[pos].funfacts[--index]
				} `
			);
		}
	}
};

const getPosition = (code) => {
	for (let i = 0; i < data.states.length; i++) {
		if (data.states[i].code === code) {
			return i;
		}
	}
};

const dbData = async (res, index, state, funfact) => {
	if (state && index < state.funfacts.length) {
		state.funfacts[index] = funfact;
		const result = await state.save();
		return res.json(result);
	} else {
		return res.status(400).json({ message: `index was out of range` });
	}
};

const deleteFunfact = async (req, res) => {
	let index = req.body.index;
	if (!index) {
		res.status(400).json({ message: "Index parameter is required" });
	}
	if (index <= 0) {
		res.status(400).json({ message: "Invalid index entered" });
	}
	index--;
	const code = req.params.state;
	const state = await funFacts.findOne({ stateCode: code });
	const pos = getPosition(code);
	const facts = data.states[pos].funfacts;
	if (facts && facts.length !== 0) {
        const len = state.funfacts.length;
		factLength = facts.length - len;
        console.log(`${factLength} \n ${len} \n ${index}`);
		if (index > factLength) {
			await deleteFact(res, state, index - factLength);
		} else {
			const fact = data.states[pos].funfacts.splice(index, 1);
			return res.json(`${fact} was deleted`);
		}
	} else {
		await deleteFact(res, state, index);
	}
};

const deleteFact = async (res, state, index) => {
	if (index < state.funfacts.length) {
		state.funfacts.splice(index, 1);
		const db = await state.save();
		res.json(db);
	} else {
		res.status(400).json({ message: `${index} was out of range` });
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
