const express = require('express');
const {
  getContactsController,
  getContactByIdController,
  addContactController,
  deleteContactController,
  updateContactController,
  patchContactStatusController,
} = require('../../controllers/contactsController');
const {
  updateValidationMidleware,
  createValidationMidleware,
} = require('../../middlewares/validationMiddleware');

const router = express.Router();

router.get('/', getContactsController);
router.post('/', createValidationMidleware, addContactController);

router.get('/:contactId', getContactByIdController);
router.put('/:contactId', updateValidationMidleware, updateContactController);
router.delete('/:contactId', deleteContactController);

router.patch(
  '/:contactId/favorite',
  updateValidationMidleware,
  patchContactStatusController
);

module.exports = router;
