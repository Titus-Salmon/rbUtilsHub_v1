      let discoMulti;

      function ongDiscoMulti(reqBody) {
        if (reqBody.ongDisco_WS !== null) {
          //if there is a disco, apply it to get the actual cost
          discoMulti = req.body.ongDisco_WS / 100
        } else {
          //if there is no disco, just use 0 as the multiplier, so as not to change the base vendor cost
          discoMulti = 0
        }
      }

      export {
        discoMulti,
        ongDiscoMulti
      }