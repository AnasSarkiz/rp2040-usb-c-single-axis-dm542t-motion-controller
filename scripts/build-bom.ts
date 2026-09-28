import { writeFileSync } from "node:fs"
import { passives } from "../lib/passives"
import catalog from "../lib/catalog.json"

const imported = [
  ["U7", "C12462", "4.75 V driver buck-boost regulator"],
  ["U8", "C55266", "Driver branch current-limiting switch"],
  ["U9", "C96333", "3.3 V brownout supervisor"],
  ["L1", "C80662", "1.5 uH buck-boost inductor"],
  ["U1", "C2040", "RP2040 processor"],
  ["U2", "C131025", "16-Mbit boot flash"],
  ["U3", "C51118", "3.3 V LDO"],
  ["U4", "C7519", "USB ESD"],
  ["U5", "C2869734", "Reverse-current blocker"],
  ["U6", "C7519", "Limit input ESD"],
  ["J1", "C165948", "USB-C receptacle"],
  ["F1", "C17313", "500 mA hold resettable fuse"],
  ["Y1", "C20625731", "12 MHz 10 pF crystal"],
  ["SW1", "C318884", "BOOTSEL"],
  ["SW2", "C318884", "RESET"],
  ["LED1", "C2297", "Power LED"],
  ["LED2", "C2297", "Status LED"],
  ...["Q1", "Q2", "Q3", "Q4", "Q5"].map((name) => [
    name,
    "C20917",
    "Output MOSFET",
  ]),
  ...["J2", "J3", "J4", "J5", "J6"].map((name) => [
    name,
    "C474892",
    "3.5 mm pitch 2-pole screw terminal",
  ]),
]
const fitted = [
  ...imported.map(([name, code, purpose]) => ({ name, code, purpose })),
  ...passives,
]
const rows = fitted.map((part) => {
  const entry = catalog.find((entry) => entry.componentCode === part.code)
  if (!entry || !entry.dataManualUrl || !entry.canPresaleNumber)
    throw new Error(`Missing sourcing evidence: ${part.name}`)
  return {
    Designator: part.name,
    Quantity: 1,
    Comment:
      "rating" in part ? `${part.rating}: ${part.purpose}` : part.purpose,
    Manufacturer: entry.componentBrandEn,
    "Manufacturer Part Number": entry.componentModelEn,
    Footprint: entry.componentSpecificationEn,
    "LCSC Part #": entry.componentCode,
    "Catalog URL": entry.url,
    "Datasheet URL": entry.dataManualOfficialLink || entry.dataManualUrl,
    "Assembly category":
      entry.componentLibraryType === "base" ? "Basic" : "Extended",
    "Assembly mode": entry.assemblyMode,
    "JLC assembly eligible quantity": entry.canPresaleNumber,
    "Checked on": entry.checked_on,
  }
})
const header = Object.keys(rows[0])
const csv = (row: object) =>
  Object.values(row)
    .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
    .join(",")
writeFileSync("bom.csv", [csv(header), ...rows.map(csv)].join("\n") + "\n")
writeFileSync(
  "BOM.md",
  `# A0 bill of materials\n\n**Untested prototype — schematic reviewed; routed fabrication validation pending.** ${rows.length} fitted electronic components. Each row maps to official JLC assembly catalog evidence with individual UTC check dates, stored in references/catalog. Availability is a dated snapshot, not a reservation. Through-hole terminals use manualWeld: confirm Standard PCBA/manual insertion eligibility at quote review.\n\nCSV follows [JLC's BOM field guidance](https://jlcpcb.com/help/article/bill-of-materials-for-pcb-assembly), with extra audit columns. No CPL/assembly upload has been approved.\n\n| Ref | Qty | Function/value | Manufacturer | Full MPN | Package | JLC part | Datasheet | Assembly | Eligible qty | Checked |\n|---|---:|---|---|---|---|---|---|---|---:|---|\n` +
    rows
      .map(
        (row) =>
          `| ${row.Designator} | 1 | ${row.Comment} | ${row.Manufacturer} | ${row["Manufacturer Part Number"]} | ${row.Footprint} | [${row["LCSC Part #"]}](${row["Catalog URL"]}) | [PDF](${row["Datasheet URL"]}) | ${row["Assembly category"]}, ${row["Assembly mode"]} | ${row["JLC assembly eligible quantity"]} | ${row["Checked on"]} |`,
      )
      .join("\n") +
    "\n\nFour 3.2 mm NPTH holes and eleven bare copper test pads are PCB features, not purchased parts. M3 fasteners/standoffs are not supplied; select hardware within the 8 mm diameter clearance envelope after enclosure design. Motor, driver, USB cable and limit switches are external equipment.\n",
)
writeFileSync(
  "evidence/bom-count.json",
  JSON.stringify(
    {
      electronicComponents: rows.length,
      uniqueCatalogParts: new Set(fitted.map((part) => part.code)).size,
    },
    null,
    2,
  ) + "\n",
)
console.log(`BOM: ${rows.length} fitted components with exact JLC mappings`)
