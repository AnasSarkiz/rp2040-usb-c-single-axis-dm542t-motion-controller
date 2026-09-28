#include <string.h>
#include "tusb.h"
#include "pico/unique_id.h"

// Raspberry Pi's common Pico SDK CDC identity. Do not add other USB classes
// under this PID. A commercial release must review the VID/PID usage terms.
static const tusb_desc_device_t device_descriptor = {
    .bLength=sizeof(tusb_desc_device_t), .bDescriptorType=TUSB_DESC_DEVICE,
    .bcdUSB=0x0200, .bDeviceClass=TUSB_CLASS_MISC,
    .bDeviceSubClass=MISC_SUBCLASS_COMMON, .bDeviceProtocol=MISC_PROTOCOL_IAD,
    .bMaxPacketSize0=CFG_TUD_ENDPOINT0_SIZE,
    .idVendor=0x2e8a, .idProduct=0x000a, .bcdDevice=0x0100,
    .iManufacturer=1, .iProduct=2, .iSerialNumber=3, .bNumConfigurations=1,
};
static const uint8_t configuration_descriptor[] = {
    TUD_CONFIG_DESCRIPTOR(1, 2, 0, TUD_CONFIG_DESC_LEN+TUD_CDC_DESC_LEN, 0, 500),
    TUD_CDC_DESCRIPTOR(0, 4, 0x81, 8, 0x02, 0x82, 64),
};
const uint8_t *tud_descriptor_device_cb(void) { return (const uint8_t *)&device_descriptor; }
const uint8_t *tud_descriptor_configuration_cb(uint8_t index) {
    return index==0 ? configuration_descriptor : NULL;
}
const uint16_t *tud_descriptor_string_cb(uint8_t index, uint16_t language_id) {
    (void)language_id;
    static uint16_t descriptor[64];
    static char serial[PICO_UNIQUE_BOARD_ID_SIZE_BYTES*2+1];
    const char *text;
    if (index==0) { descriptor[0]=(TUSB_DESC_STRING<<8)|4; descriptor[1]=0x0409; return descriptor; }
    switch (index) {
        case 1: text="AnasSarkiz"; break;
        case 2: text="RP2040 USB-C Motion Controller A0"; break;
        case 3: pico_get_unique_board_id_string(serial,sizeof(serial)); text=serial; break;
        case 4: text="Motion commands"; break;
        default: return NULL;
    }
    size_t length=strlen(text);
    if (length>63) return NULL;
    for (size_t i=0;i<length;i++) descriptor[i+1]=(uint8_t)text[i];
    descriptor[0]=(TUSB_DESC_STRING<<8)|(2*length+2);
    return descriptor;
}
