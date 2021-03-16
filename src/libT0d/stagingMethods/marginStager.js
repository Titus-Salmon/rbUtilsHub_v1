function marginStager(defaultMargins, vendorMargins, stagedMargins) {
  for (let i = 0; i < defaultMargins.length; i++) {
    for (let j = 0; j < Object.keys(vendorMargins).length; j++) {
      //v//need to separate out dptName from dptNumber, since they're in the form of: vitSupp_157, for example
      let departmentName = Object.keys(vendorMargins)[j]
      departmentName = departmentName.split('_')[0]
      let departmentNumber = Object.keys(vendorMargins)[j]
      departmentNumber = departmentNumber.split('_')[1]
      console.log(`[${j}] departmentNumber==> ${departmentNumber}`)
      //^//need to separate out dptName from dptNumber, since they're in the form of: vitSupp_157, for example
      if (defaultMargins[i]['dptName'] === departmentName) {
        console.log(`defaultMargins[i]['margin']==> ${defaultMargins[i]['margin']}`)
        console.log(`Object.keys(vendorMargins)[j]==> ${Object.keys(vendorMargins)[j]}`)
        //need to use wellness margins from rainbowcat, if they differ from the defaults
        //put staged margins in stagedMargins
        //v//if default wellness margin !== vendor-specific wellness margin
        if (defaultMargins[i]['margin'] !== Object.values(vendorMargins)[j]) {
          //use vendor-specific wellness margin
          //replace default value in stagedMargins with vendor-specific value
          // let replacementMarg['dptName'] = 
          let replacementMarg = {
            "dptName": `${departmentName}`,
            "dptNumb": `${departmentNumber}`,
            "margin": `${Object.values(vendorMargins)[j]}`,
            "nonDefaultMargin": "nonDefaultMargin"
          }
          stagedMargins.splice(i, 1, replacementMarg)
        }
      }
    }
  }
}

export default marginStager