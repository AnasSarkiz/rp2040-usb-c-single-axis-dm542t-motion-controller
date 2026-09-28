import concurrent.futures
import json
from pathlib import Path
import re
from datetime import datetime, timezone
import urllib.request

CODES = 'C2040 C131025 C51118 C7519 C165948 C20917 C20625731 C318884 C474892 C2869734 C23186 C25190 C21190 C25804 C22775 C25803 C1525 C52923 C1548 C14663 C2297 C17313'.split()
KEYS = 'componentCode componentModelEn componentBrandEn componentSpecificationEn describe dataManualUrl dataManualOfficialLink assemblyMode componentLibraryType componentProductType needAuditFlag canPresaleNumber overseasStockCount noBuyReason'.split()

def retrieve(code):
    url='https://jlcpcb.com/partdetail/'+code
    request=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
    html=urllib.request.urlopen(request,timeout=45).read().decode()
    payload=''.join(json.loads(m) for m in re.findall(r'self\.__next_f\.push\(\[1,(".*?")\]\)',html))
    result={'url':url,'checked_on':datetime.now(timezone.utc).date().isoformat()}
    decoder=json.JSONDecoder()
    for match in re.finditer(r'\{"component(?:Code|ModelEn)"',payload):
        record,_=decoder.raw_decode(payload[match.start():])
        if record.get('componentCode')==code:
            result.update({k:record[k] for k in KEYS if k in record})
    if 'componentModelEn' not in result:
        raise ValueError('Missing catalog identity: '+code)
    Path('references/catalog').mkdir(exist_ok=True)
    Path('references/catalog',code+'.json').write_text(json.dumps(result,indent=2)+'\n')
    return result

if __name__ == '__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
     for record in pool.map(retrieve,CODES):
        print(record['componentCode'],record['componentModelEn'],record.get('componentSpecificationEn'),record.get('componentLibraryType'),record.get('overseasStockCount'),record.get('canPresaleNumber'),record.get('assemblyMode'),flush=True)
