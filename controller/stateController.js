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
		data.states[i].funfacts = facts.funfacts;
	}
	if (req.query.contig) {
		getContigousStates(req, res);
	}
	res.status(201).json(data.states);
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
	res.status(201).json(contigousStates);
};

const getState = async (req, res) => {
	let code = req.params.state;
	const state = data.states.find((state) => code === state.code);
	const facts = await funFacts.findOne({ stateCode: code });
    if(facts){
	    state.funfacts = facts.funfacts;
    }
	res.status(201).json(state);
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
	stateWithPopulation.population = state.population;
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

const getFunfact = async (req, res) => {
	const code = req.params.state;
	const dbFacts = await funFacts.findOne({ stateCode: code }).exec();
	if (dbFacts) {
		const randomFact = {
			funfact: dbFacts.funfacts[Math.floor(Math.random() * dbFacts.funfacts.length)],
		};
        return res.status(201).json(randomFact);
	}
	return res.status(400).json("No funfacts for the state");
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
		} catch (error) {
			res.status(400).json({ message: error.message });
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
	if (state && index < state.funfacts.length) {
		state.funfacts[index] = funfact;
		await state.save();
		return res.status(201).json({success: `Updated fact ${++index} in ${code}`});
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
    if(state.funfacts.length === 0){
        res.status(400).json({message: `No funfacts found for ${code}`});
    }
	if (index < state.funfacts.length) {
		const fact = state.funfacts.splice(index, 1);
		await state.save();
		res.status(201).json({Success: `Deleted index ${fact} from ${code}`});
	} else {
		res.status(400).json({ message: `${++index} was out of range` });
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
