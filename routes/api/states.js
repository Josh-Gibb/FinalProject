const express = require("express");
const router = express();
const stateController = require("../../controller/stateController.js");
const { validateState } = require("../../middleware/stateAuthenticator.js");

router.route("/").get(stateController.getAllStates);

router.route("/:state").get(validateState, stateController.getState);

router.route("/:state/capital").get(validateState, stateController.getCaptial);

router.route("/:state/population").get(validateState, stateController.getPopulation);

router.route("/:state/admission").get(validateState, stateController.getAdmission);

router.route("/:state/nickname").get(validateState, stateController.getNickname);

router
	.route("/:state/funfact")
	.post(validateState, stateController.insertFunfacts)
	.get(validateState, stateController.getFunfact)
	.delete(validateState, stateController.deleteFunfact)
	.patch(validateState, stateController.updateFunfact);

module.exports = router;
