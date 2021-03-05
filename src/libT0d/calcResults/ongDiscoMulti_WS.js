      let discoMulti_WS;

      function ongDiscoMulti_WS(reqBody) {
        if (reqBody.ongDisco_WS !== null) {
          //if there is a disco, apply it to get the actual cost
          discoMulti_WS = reqBody.ongDisco_WS / 100
        } else {
          //if there is no disco, just use 0 as the multiplier, so as not to change the base vendor cost
          discoMulti_WS = 0
        }
      }

      export {
        discoMulti_WS,
        ongDiscoMulti_WS
      }