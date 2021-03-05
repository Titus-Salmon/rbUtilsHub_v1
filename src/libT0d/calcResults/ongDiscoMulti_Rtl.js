      let discoMulti_Rtl;

      function ongDiscoMulti_Rtl(reqBody) {
        if (reqBody.ongDisco_Rtl !== null) {
          //if there is a disco, apply it to get the actual cost
          discoMulti_Rtl = reqBody.ongDisco_Rtl / 100
        } else {
          //if there is no disco, just use 0 as the multiplier, so as not to change the retail
          discoMulti_Rtl = 0
        }
      }

      export {
        discoMulti_Rtl,
        ongDiscoMulti_Rtl
      }