import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Device } from "../../models/devices";
import { BadRequestError } from "../../errors/bad-request-error";
import { requireAuth, currentUser, validateRequest } from "../../middlewares";
import { NotFoundError } from "../../errors/not-found-error";

const router = express.Router();

router.put(
  "/devices/checkout/:id",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const device = await Device.findById(req.params.id);
    // const user = await Device.findOne(req.currentUser!.id);
    const user = await Device.findOne({
      userId: req.currentUser!.id,
      isCheckedOut: false,
    });
    if (!device) {
      throw new NotFoundError();
    }
    // -------------------------

    const timePeriod = new Date().getHours();
    if (timePeriod >= 9 && timePeriod <= 17) {
      if (
        device.isCheckedOut === false &&
        device.userId !== req.currentUser!.id
      ) {
        throw new BadRequestError("This device is checked-in by another user");
      }
      if (user) {
        if (user?.isCheckedOut === false && device.id !== user.id) {
          throw new BadRequestError(
            "You have already checked-in with another device"
          );
        }
      }
      device.set({
        lastCheckedOutBy: `${req.currentUser!.firstName} ${
          req.currentUser!.lastName
        }`,
        isCheckedOut: !device.isCheckedOut,
        lastCheckedOutDate: new Date(),
        userId: req.currentUser!.id,
      });

      await device.save();
      res.json(device);
    } else {
      throw new BadRequestError(
        "User can only check-in and check-out between 9am to 5pm"
      );
    }

    // -------------------------
  }
);

export { router as checkoutRouter };
