import { rb_inventory_query } from "./funcLibT0d/rb_inventory_query";

export async function post(req, res, next) {
  console.log(`JSON.stringify(req.body)==> ${JSON.stringify(req.body)}`);
  let rb_inventoryQuery = req.body.initialQueryText;
  let rb_invUPCs = [];

  rb_inventory_query(rb_inventoryQuery, rb_invUPCs);
}
