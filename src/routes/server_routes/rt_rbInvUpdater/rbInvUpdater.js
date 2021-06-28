import { rb_inventory_query } from "./funcLibT0d/rb_inventory_query";
import { auditResObjStore } from "../../../stores/rbInvUpdater/st_auditResObjStore";

export async function post(req, res, next) {
  console.log(`JSON.stringify(req.body)==> ${JSON.stringify(req.body)}`);
  let rb_inventoryQuery = req.body.initialQueryText;
  let rb_invUPCs = [];

  rb_inventory_query(rb_inventoryQuery, rb_invUPCs);
  if ($auditResObjStore[0].auditResObjData !== null) {
    console.log(
      `JSON.stringify(auditResObjStore[0].auditResObjData)==> ${JSON.stringify(
        auditResObjStore[0].auditResObjData
      )}`
    );
    res.json(auditResObjStore[0].auditResObjData);
  }
}
