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
        if(facts){
		    data.states[i].funfacts = facts.funfacts;
        }
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

const getFunfact = async (req, res) => {
	const code = req.params.state;
	const dbFacts = await funFacts.findOne({ stateCode: code }).exec();
	if (dbFacts && dbFacts.funfacts.length > 0) {
		const randomFact = {
			funfact: dbFacts.funfacts[Math.floor(Math.random() * dbFacts.funfacts.length)],
		};
        return res.status(201).json(randomFact);
	}
	return res.status(400).json("No funfacts for the state");
};

module.exports = {
	getAllStates,
	getState,
	getFunfact,
};
