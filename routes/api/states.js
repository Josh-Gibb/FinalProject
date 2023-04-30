const express = require("express");
const router = express();
const stateController = require('../../controller/stateController.js');

router.route("/").get(stateController.getAllStates);

router.route("/:state").get(stateController.getState);

router.route("/:state/capital").get(stateController.getCaptial);

router.route("/:state/population").get(stateController.getPopulation);

router.route("/:state/admission").get(stateController.getAdmission);

router.route("/:state/nickname").get(stateController.getNickname);

router.route("/:state/funfact").post(stateController.insertFunfacts);

router.route("/:state/funfact").get(stateController.getFunfact);

router.route("/:state/funfact").delete(stateController.deleteFunfact);

router.route("/:state/funfact").patch(stateController.updateFunfact);

module.exports = router;