const charmProfiles = {
  grocery: {
    //everything below lowercutoffRqdRtl gets lowercutoff charms applied
    //^//(double-ckeck that)
    lowerCutoffRqdRtl: {
      name: "lowerCutoffRqdRtl",
      dollars: 2
    },

    lowercutoffCharms: [{
      charmName: "lowerCutoffCharm1",
      cents: .19
    }, {
      charmName: "lowerCutoffCharm2",
      cents: .29
    }, {
      charmName: "lowerCutoffCharm3",
      cents: .39
    }, {
      charmName: "lowerCutoffCharm4",
      cents: .49
    }, {
      charmName: "lowerCutoffCharm5",
      cents: .59
    }, {
      charmName: "lowerCutoffCharm6",
      cents: .79
    }, {
      charmName: "lowerCutoffCharm7",
      cents: .99
    }],

    //everything between lowercutoffRqdRtl and uppercutofReqdRtl gets default charms applied
    //^//(double-ckeck that)
    upperCutoffRqdRtl: {
      name: "upperCutoffRqdRtl",
      dollars: 12
    },

    defaultCharms: [{
      charmName: "defaultCharm1",
      cents: .29
    }, {
      charmName: "defaultCharm2",
      cents: .49
    }, {
      charmName: "defaultCharm3",
      cents: .79
    }, {
      charmName: "defaultCharm4",
      cents: .99
    }]
  },


  wellness: {
    //everything below lowercutoffRqdRtl gets lowercutoff charms applied
    //^//(double-ckeck that)
    lowerCutoffRqdRtl: {
      name: "lowerCutoffRqdRtl",
      dollars: 10
    },

    lowercutoffCharms: [{
      charmName: "lowerCutoffCharm1",
      cents: .29
    }, {
      charmName: "lowerCutoffCharm2",
      cents: .29
    }, {
      charmName: "lowerCutoffCharm3",
      cents: .49
    }, {
      charmName: "lowerCutoffCharm4",
      cents: .49
    }, {
      charmNanme: "lowerCutoffCharm5",
      cents: .79
    }, {
      charmNanme: "lowerCutoffCharm6",
      cents: .79
    }, {
      charmName: "lowerCutoffCharm7",
      cents: .99
    }],

    //everything between lowercutoffRqdRtl and uppercutofReqdRtl gets default charms applied
    //^//(double-ckeck that)
    upperCutoffRqdRtl: {
      name: "upperCutoffRqdRtl",
      dollars: 9999
    },

    defaultCharms: [{
      charmName: "defaultCharm1",
      cents: .49
    }, {
      charmName: "defaultCharm2",
      cents: .49
    }, {
      charmName: "defaultCharm3",
      cents: .99
    }, {
      charmName: "defaultCharm4",
      cents: .99
    }],

  }
}

export default charmProfiles