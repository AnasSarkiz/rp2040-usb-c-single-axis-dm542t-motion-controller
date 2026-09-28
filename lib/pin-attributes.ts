// Datasheet pin roles. Both numeric identifiers and importer aliases carry the same role.
export const RP2040Attributes = {
  pin1: {
    requiresPower: true,
  },
  IOVDD6: {
    requiresPower: true,
  },
  pin2: {},
  GPIO0: {},
  pin3: {},
  GPIO1: {},
  pin4: {},
  GPIO2: {},
  pin5: {},
  GPIO3: {},
  pin6: {},
  GPIO4: {},
  pin7: {},
  GPIO5: {},
  pin8: {},
  GPIO6: {},
  pin9: {},
  GPIO7: {},
  pin10: {
    requiresPower: true,
  },
  IOVDD5: {
    requiresPower: true,
  },
  pin11: {},
  GPIO8: {},
  pin12: {
    doNotConnect: true,
  },
  GPIO9: {
    doNotConnect: true,
  },
  pin13: {
    doNotConnect: true,
  },
  GPIO10: {
    doNotConnect: true,
  },
  pin14: {
    doNotConnect: true,
  },
  GPIO11: {
    doNotConnect: true,
  },
  pin15: {
    doNotConnect: true,
  },
  GPIO12: {
    doNotConnect: true,
  },
  pin16: {
    doNotConnect: true,
  },
  GPIO13: {
    doNotConnect: true,
  },
  pin17: {
    doNotConnect: true,
  },
  GPIO14: {
    doNotConnect: true,
  },
  pin18: {
    doNotConnect: true,
  },
  GPIO15: {
    doNotConnect: true,
  },
  pin19: {
    requiresGround: true,
  },
  TESTEN: {
    requiresGround: true,
  },
  pin20: {},
  XIN: {},
  pin21: {},
  XOUT: {},
  pin22: {
    requiresPower: true,
  },
  IOVDD4: {
    requiresPower: true,
  },
  pin23: {
    requiresPower: true,
  },
  DVDD2: {
    requiresPower: true,
  },
  pin24: {},
  SWCLK: {},
  pin25: {},
  SWD: {},
  pin26: {},
  RUN: {},
  pin27: {
    doNotConnect: true,
  },
  GPIO16: {
    doNotConnect: true,
  },
  pin28: {
    doNotConnect: true,
  },
  GPIO17: {
    doNotConnect: true,
  },
  pin29: {
    doNotConnect: true,
  },
  GPIO18: {
    doNotConnect: true,
  },
  pin30: {
    doNotConnect: true,
  },
  GPIO19: {
    doNotConnect: true,
  },
  pin31: {
    doNotConnect: true,
  },
  GPIO20: {
    doNotConnect: true,
  },
  pin32: {
    doNotConnect: true,
  },
  GPIO21: {
    doNotConnect: true,
  },
  pin33: {
    requiresPower: true,
  },
  IOVDD3: {
    requiresPower: true,
  },
  pin34: {
    doNotConnect: true,
  },
  GPIO22: {
    doNotConnect: true,
  },
  pin35: {
    doNotConnect: true,
  },
  GPIO23: {
    doNotConnect: true,
  },
  pin36: {
    doNotConnect: true,
  },
  GPIO24: {
    doNotConnect: true,
  },
  pin37: {},
  GPIO25: {},
  pin38: {},
  GPIO26_ADC0: {},
  pin39: {
    doNotConnect: true,
  },
  GPIO27_ADC1: {
    doNotConnect: true,
  },
  pin40: {
    doNotConnect: true,
  },
  GPIO28_ADC2: {
    doNotConnect: true,
  },
  pin41: {
    doNotConnect: true,
  },
  GPIO29_ADC3: {
    doNotConnect: true,
  },
  pin42: {
    requiresPower: true,
  },
  IOVDD2: {
    requiresPower: true,
  },
  pin43: {
    requiresPower: true,
  },
  ADC_AVDD: {
    requiresPower: true,
  },
  pin44: {
    requiresPower: true,
  },
  VREG_IN: {
    requiresPower: true,
  },
  pin45: {
    providesPower: true,
  },
  VREG_VOUT: {
    providesPower: true,
  },
  pin46: {},
  USB_DM: {},
  pin47: {},
  USB_DP: {},
  pin48: {
    requiresPower: true,
  },
  USB_VDD: {
    requiresPower: true,
  },
  pin49: {
    requiresPower: true,
  },
  IOVDD1: {
    requiresPower: true,
  },
  pin50: {
    requiresPower: true,
  },
  DVDD1: {
    requiresPower: true,
  },
  pin51: {},
  QSPI_SD3: {},
  pin52: {},
  QSPI_SCLK: {},
  pin53: {},
  QSPI_SD0: {},
  pin54: {},
  QSPI_SD2: {},
  pin55: {},
  QSPI_SD1: {},
  pin56: {},
  QSPI_SS: {},
  pin57: {
    requiresGround: true,
  },
  GND: {
    requiresGround: true,
  },
} as const

export const TYPE_C_31_M_12Attributes = {
  pin1: {
    requiresGround: true,
  },
  EH2: {
    requiresGround: true,
  },
  pin2: {
    requiresGround: true,
  },
  EH1: {
    requiresGround: true,
  },
  pin3: {
    requiresGround: true,
  },
  EH4: {
    requiresGround: true,
  },
  pin4: {
    requiresGround: true,
  },
  EH3: {
    requiresGround: true,
  },
  pin5: {
    doNotConnect: true,
  },
  B8: {
    doNotConnect: true,
  },
  SBU2: {
    doNotConnect: true,
  },
  pin6: {
    isPassive: true,
  },
  A5: {
    isPassive: true,
  },
  CC1: {
    isPassive: true,
  },
  pin7: {
    isPassive: true,
  },
  B7: {
    isPassive: true,
  },
  DN2: {
    isPassive: true,
  },
  pin8: {
    isPassive: true,
  },
  A6: {
    isPassive: true,
  },
  DP1: {
    isPassive: true,
  },
  pin9: {
    isPassive: true,
  },
  A7: {
    isPassive: true,
  },
  DN1: {
    isPassive: true,
  },
  pin10: {
    isPassive: true,
  },
  B6: {
    isPassive: true,
  },
  DP2: {
    isPassive: true,
  },
  pin11: {},
  A8: {
    doNotConnect: true,
  },
  SBU1: {
    doNotConnect: true,
  },
  pin12: {
    isPassive: true,
  },
  B5: {
    isPassive: true,
  },
  CC2: {
    isPassive: true,
  },
  pin13: {
    requiresGround: true,
  },
  A1B12: {
    requiresGround: true,
  },
  GND1: {
    requiresGround: true,
  },
  pin14: {
    requiresGround: true,
  },
  B1A12: {
    requiresGround: true,
  },
  GND2: {
    requiresGround: true,
  },
  pin15: {
    providesPower: true,
  },
  B4A9: {
    providesPower: true,
  },
  VBUS1: {
    providesPower: true,
  },
  pin16: {
    providesPower: true,
  },
  A4B9: {
    providesPower: true,
  },
  VBUS2: {
    providesPower: true,
  },
} as const

export const AO3400AAttributes = {
  pin1: {
    isInput: true,
  },
  G: {
    isInput: true,
  },
  pin2: {
    isPassive: true,
  },
  S: {
    isPassive: true,
  },
  pin3: {
    isPassive: true,
  },
  D: {
    isPassive: true,
  },
} as const
