const charmProfiles = {
  grocery: {
    //everything below lowercutoffRqdRtl gets lowercutoff charms applied
    //^//(double-ckeck that)
    lowerCutoffRqdRtl: {
      name: "lowerCutoffRqdRtlGroc",
      dollars: 2
    },

    lowercutoffCharms: [{
      charmName: "lowerCutoffCharmGroc1",
      cents: .19
    }, {
      charmName: "lowerCutoffCharmGroc2",
      cents: .29
    }, {
      charmName: "lowerCutoffCharmGroc3",
      cents: .39
    }, {
      charmName: "lowerCutoffCharmGroc4",
      cents: .49
    }, {
      charmName: "lowerCutoffCharmGroc5",
      cents: .59
    }, {
      charmName: "lowerCutoffCharmGroc6",
      cents: .79
    }, {
      charmName: "lowerCutoffCharmGroc7",
      cents: .99
    }],

    //everything between lowercutoffRqdRtl and uppercutofReqdRtl gets default charms applied
    //^//(double-ckeck that)
    upperCutoffRqdRtl: {
      name: "upperCutoffRqdRtlGroc",
      dollars: 12
    },

    defaultCharms: [{
      charmName: "defaultCharmGroc1",
      cents: .29
    }, {
      charmName: "defaultCharmGroc2",
      cents: .49
    }, {
      charmName: "defaultCharmGroc3",
      cents: .79
    }, {
      charmName: "defaultCharmGroc4",
      cents: .99
    }]
  },


  wellness: {
    //everything below lowercutoffRqdRtl gets lowercutoff charms applied
    //^//(double-ckeck that)
    lowerCutoffRqdRtl: {
      name: "lowerCutoffRqdRtlWell",
      dollars: 10
    },

    lowercutoffCharms: [{
      charmName: "lowerCutoffCharmWell1",
      cents: .29
    }, {
      charmName: "lowerCutoffCharmWell2",
      cents: .29
    }, {
      charmName: "lowerCutoffCharmWell3",
      cents: .49
    }, {
      charmName: "lowerCutoffCharmWell4",
      cents: .49
    }, {
      charmNanme: "lowerCutoffCharmWell5",
      cents: .79
    }, {
      charmNanme: "lowerCutoffCharmWell6",
      cents: .79
    }, {
      charmName: "lowerCutoffCharmWell7",
      cents: .99
    }],

    //everything between lowercutoffRqdRtl and uppercutofReqdRtl gets default charms applied
    //^//(double-ckeck that)
    upperCutoffRqdRtl: {
      name: "upperCutoffRqdRtlWell",
      dollars: 9999
    },

    defaultCharms: [{
      charmName: "defaultCharmWell1",
      cents: .49
    }, {
      charmName: "defaultCharmWell2",
      cents: .49
    }, {
      charmName: "defaultCharmWell3",
      cents: .99
    }, {
      charmName: "defaultCharmWell4",
      cents: .99
    }],

  }
}

export default charmProfiles