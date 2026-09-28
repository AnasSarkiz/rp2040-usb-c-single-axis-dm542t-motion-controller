"""Physical pad, via and drilled-hole outlines shared by copper audits."""
from shapely.geometry import Point, Polygon, LineString, box
from shapely.affinity import rotate, translate

def geometry(part, drill=False):
    shape=part.get('hole_shape',part.get('shape','circle')) if drill else part.get('shape','circle')
    if shape=='polygon':
        if drill: raise ValueError('Polygon drill unsupported')
        return Polygon([(p['x'],p['y']) for p in part['points']])
    x,y=part.get('x',0),part.get('y',0)
    prefix='hole_' if drill else ('outer_' if part['type'] in ['pcb_plated_hole','pcb_via'] else '')
    diameter=part.get(prefix+'diameter')
    if diameter is None and shape=='circle': diameter=part.get('radius',0)*2
    if shape=='circle':
        assert diameter and diameter>0, part
        return Point(x,y).buffer(diameter/2,quad_segs=64)
    width,height=part[prefix+'width'],part[prefix+'height']
    if shape in ['rect','rotated_rect']:
        local=box(-width/2,-height/2,width/2,height/2)
    elif shape=='pill':
        radius=min(width,height)/2
        if width>=height: ends=[(-(width-height)/2,0),((width-height)/2,0)]
        else: ends=[(0,-(height-width)/2),(0,(height-width)/2)]
        local=LineString(ends).buffer(radius,quad_segs=64)
    else: raise ValueError(f'Unsupported shape: {shape}')
    return translate(rotate(local,part.get('ccw_rotation',0),origin=(0,0)),x,y)
