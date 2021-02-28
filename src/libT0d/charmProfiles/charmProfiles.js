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
    upperCutoffRqdRtl: 12,

    defaultCharm1: .29,
    defaultCharm2: .49,
    defaultCharm3: .79,
    defaultCharm4: .99,
  },
  wellness: {
    //everything below lowercutoffRqdRtl gets lowercutoff charms applied
    //^//(double-ckeck that)
    lowerCutoffRqdRtl: 10,

    lowerCutoffCharm1: .29,
    lowerCutoffCharm2: .29,
    lowerCutoffCharm3: .49,
    lowerCutoffCharm4: .49,
    lowerCutoffCharm5: .79,
    lowerCutoffCharm6: .79,
    lowerCutoffCharm7: .99,

    //everything between lowercutoffRqdRtl and uppercutofReqdRtl gets default charms applied
    //^//(double-ckeck that)
    upperCutoffRqdRtl: 9999,

    defaultCharm1: .49,
    defaultCharm2: .49,
    defaultCharm3: .99,
    defaultCharm4: .99,

  }
}

export default charmProfiles