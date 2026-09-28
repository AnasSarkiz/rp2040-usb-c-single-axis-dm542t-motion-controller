import json,re,urllib.request,time,sys
from pathlib import Path
codes=sys.argv[1:] or ['C318884','C20625731','C131025','C17313','C165948']
for code in codes:
    request=urllib.request.Request('https://jlcpcb.com/partdetail/'+code,headers={'User-Agent':'Mozilla/5.0'})
    html=urllib.request.urlopen(request,timeout=30).read().decode()
    payload=''.join(json.loads(m) for m in re.findall(r'self\.__next_f\.push\(\[1,(".*?")\]\)',html))
    strings={m[1]:payload[m.end():m.end()+int(m[2],16)] for m in re.finditer(r'([0-9a-f]+):T([0-9a-f]+),',payload)}
    decoder=json.JSONDecoder()
    for match in re.finditer(r'\{"component(?:Code|ModelEn)"',payload):
        record,_=decoder.raw_decode(payload[match.start():])
        if record.get('componentCode')==code and record.get('dataManualFileAccessIdUrl'):
            ref=record['dataManualFileAccessIdUrl']
            url=strings[ref[1:]] if ref.startswith('$') else ref
            pdf=urllib.request.urlopen(url,timeout=30).read()
            if not pdf.startswith(b'%PDF'): raise RuntimeError('Invalid PDF')
            Path('references',code+'.pdf').write_bytes(pdf)
            print(code,'saved',len(pdf),flush=True)
            break
    else: raise RuntimeError('No downloadable datasheet for '+code)
    time.sleep(1)
