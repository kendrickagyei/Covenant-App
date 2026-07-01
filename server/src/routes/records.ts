import { Router } from "express";
import { asyncRoute, parseIdParam } from "../http";
import {
  createRecord,
  deleteRecord,
  getAllRecords,
  getRecordById,
  getTrackerResponse,
  updateRecord,
} from "../records/recordService";
import { parseRecordBody } from "../records/recordValidation";

const router = Router();

router.get("/", asyncRoute(async (req, res) => {
  if (req.query.shape === "tracker") {
    res.json(await getTrackerResponse());
    return;
  }

  res.json(await getAllRecords());
}));

router.get("/:id", asyncRoute(async (req, res) => {
  res.json(await getRecordById(parseIdParam(req)));
}));

router.post("/", asyncRoute(async (req, res) => {
  const record = await createRecord(parseRecordBody(req.body));
  res.status(201).json(record);
}));

router.put("/:id", asyncRoute(async (req, res) => {
  const record = await updateRecord(parseIdParam(req), parseRecordBody(req.body));
  res.json(record);
}));

router.delete("/:id", asyncRoute(async (req, res) => {
  await deleteRecord(parseIdParam(req));
  res.json({ message: "Record deleted" });
}));

export default router;
