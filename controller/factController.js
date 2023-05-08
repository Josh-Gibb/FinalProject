const data = {
	states: require("../model/states.json"),
	setState(data) {
		this.states = data;
	},
};

const funFacts = require("../model/state");

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
			return res.status(400).json({ message: error.message });
		}
	}
	return res.status(201).json({ success: `Added ${facts} to ${code}` });
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
		return res
			.status(201)
			.json({ success: `Updated fact ${++index} in ${code}` });
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
	if (!state) {
		return res.status(400).json({ message: `No funfacts found for ${code}` });
	}
	if (index < state.funfacts.length) {
		const fact = state.funfacts.splice(index, 1);
		await state.save();
		return res.status(201).json({ Success: `Deleted index ${fact} from ${code}` });
	} else {
		return res.status(400).json({ message: `${++index} was out of range` });
	}
};

module.exports = { deleteFunfact, insertFunfacts, updateFunfact };
