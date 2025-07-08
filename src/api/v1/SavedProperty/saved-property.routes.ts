// import { Router } from "express";
// import { container } from "tsyringe";
// import RouteErrorHandler from "../../../utils/errorHandler";
// //import { authGuard } from "../../../middleware/authGuard";
// import SavedPropertyController from "./saved-property.controller";

// const savedPropertyController = container.resolve(SavedPropertyController);
// const router = Router();

// /**
//  * @swagger
//  * /api/v1/saved-properties:
//  *   post:
//  *     summary: Save a property
//  *     tags: [Saved Properties]
//  *     description: Saves a property for the authenticated user.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               propertyId:
//  *                 type: string
//  *                 description: ID of the property to be saved
//  *     responses:
//  *       201:
//  *         description: Property saved successfully
//  *       400:
//  *         description: Bad request
//  *       404:
//  *         description: User or Property not found
//  */
// router.post("/", RouteErrorHandler(savedPropertyController.saveProperty.bind(savedPropertyController)));

// /**
//  * @swagger
//  * /api/v1/saved-properties/:
//  *   get:
//  *     summary: Get all saved properties for the current user
//  *     tags: [Saved Properties]
//  *     description: Retrieves a list of all properties saved by the authenticated user.
//  *     responses:
//  *       200:
//  *         description: List of saved properties retrieved successfully
//  *       500:
//  *         description: Server error
//  */
// router.get(
// 	"/",
// 	RouteErrorHandler(savedPropertyController.getSavedProperties.bind(savedPropertyController))
// );

// /**
//  * @swagger
//  * /api/v1/saved-properties/{propertyId}:
//  *   get:
//  *     summary: Get all users who saved a specific property
//  *     tags: [Saved Properties]
//  *     parameters:
//  *       - in: path
//  *         name: propertyId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID of the property
//  *     responses:
//  *       200:
//  *         description: List of users who saved the property
//  *       500:
//  *         description: Server error
//  */
// router.get(
// 	"/:propertyId",
// 	RouteErrorHandler(savedPropertyController.getUsersWhoSavedProperty.bind(savedPropertyController))
// );

// /**
//  * @swagger
//  * /api/v1/saved-properties/{savedPropertyId}:
//  *   delete:
//  *     summary: Delete a saved property
//  *     tags: [Saved Properties]
//  *     parameters:
//  *       - in: path
//  *         name: savedPropertyId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: ID of the saved property to delete
//  *     responses:
//  *       200:
//  *         description: Saved property removed successfully
//  *       404:
//  *         description: Saved property not found or doesn't belong to user
//  */
// router.delete(
// 	"/:savedPropertyId",
// 	RouteErrorHandler(savedPropertyController.deleteSavedProperty.bind(savedPropertyController))
// );

// export default router;
