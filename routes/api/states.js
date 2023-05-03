const express = require("express");
const router = express();
const stateController = require("../../controller/stateController.js");
const attributeController = require('../../controller/attributeController');
const factController = require('../../controller/factController');
const { validateState } = require("../../middleware/stateAuthenticator.js");

router.route("/").get(stateController.getAllStates);

router.route("/:state").get(validateState, stateController.getState);

router.route("/:state/capital").get(validateState, attributeController.getCaptial);

router.route("/:state/population").get(validateState, attributeController.getPopulation);

router.route("/:state/admission").get(validateState, attributeController.getAdmission);

router.route("/:state/nickname").get(validateState, attributeController.getNickname);

router
	.route("/:state/funfact")
	.post(validateState, factController.insertFunfacts)
	.get(validateState, stateController.getFunfact)
	.delete(validateState, factController.deleteFunfact)
	.patch(validateState, factController.updateFunfact);

module.exports = router;
