#!/usr/bin/env python3
"""Graba las voces de La Expedición Pitágoras con Kokoro (modelo abierto, Apache 2.0) → audio/<idioma>/<huella>.mp3 + audio/manifest.json

Lee voz/lineas.json (lo genera tools/voces-lista.js). Solo graba las frases que faltan, así que
al añadir textos basta con volver a ejecutarlo. Reparto: cada personaje tiene su voz en cada idioma.
En francés Kokoro solo tiene una voz (ff_siwis): los hombres y el Barón se distinguen bajando el tono.
Uso: python3 tools/voces.py [fr|es]
"""
import json, os, sys, subprocess, tempfile
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = os.path.join(ROOT, 'voz')
# personaje → (voz, velocidad, tono)   tono < 1 = más grave (sin conservar formantes: suena más masculino)
CAST = {
 'fr': {'nar': ('ff_siwis', .93, .94), 'teano': ('ff_siwis', 1.0, 1.0), 'hipatia': ('ff_siwis', .97, .95),
        'pitagoras': ('ff_siwis', .9, .74), 'arpedonapta': ('ff_siwis', .97, .8), 'tales': ('ff_siwis', .9, .76), 'hipaso': ('ff_siwis', 1.0, .84),
        'aristoteles': ('ff_siwis', .95, .78), 'socrates': ('ff_siwis', .92, .75), 'euclides': ('ff_siwis', .95, .8), 'hiparco': ('ff_siwis', .97, .82),
        'descartes': ('ff_siwis', 1.0, .83), 'platon': ('ff_siwis', .93, .77), 'guardian': ('ff_siwis', .85, .66)},
 'es': {'nar': ('ef_dora', .93, .95), 'teano': ('ef_dora', 1.0, 1.0), 'hipatia': ('ef_dora', .97, .93),
        'pitagoras': ('em_santa', .9, 1.0), 'arpedonapta': ('em_alex', .97, 1.0), 'tales': ('em_santa', .9, .95), 'hipaso': ('em_alex', 1.0, 1.05),
        'aristoteles': ('em_alex', .95, .95), 'socrates': ('em_santa', .92, .92), 'euclides': ('em_alex', .95, .9), 'hiparco': ('em_alex', 1.0, 1.0),
        'descartes': ('em_alex', 1.0, 1.08), 'platon': ('em_santa', .93, 1.0), 'guardian': ('em_santa', .85, .78)}}
CODE = {'fr': 'fr-fr', 'es': 'es'}

def main():
    langs = sys.argv[1:] or ['fr', 'es']
    lines = json.load(open(os.path.join(V, 'lineas.json'), encoding='utf-8'))
    k = Kokoro(os.path.join(V, 'kokoro-v1.0.onnx'), os.path.join(V, 'voices-v1.0.bin'))
    for l in langs:
        d = os.path.join(ROOT, 'audio', l); os.makedirs(d, exist_ok=True)
        todo = [x for x in lines[l] if not os.path.exists(os.path.join(d, x['key'] + '.mp3'))]
        print(l, len(lines[l]), 'frases,', len(todo), 'por grabar', flush=True)
        for n, x in enumerate(todo):
            voice, speed, pitch = CAST[l].get(x['who'], CAST[l]['nar'])
            a, sr = k.create(x['say'], voice=voice, speed=speed, lang=CODE[l])
            with tempfile.NamedTemporaryFile(suffix='.wav') as t:
                sf.write(t.name, a, sr)
                af = ['-af', f'rubberband=pitch={pitch}'] if pitch != 1.0 else []
                subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', t.name, *af, '-ac', '1', '-ar', '24000', '-b:a', '40k',
                                os.path.join(d, x['key'] + '.mp3')], check=True)
            if n % 25 == 0: print(l, n, '/', len(todo), flush=True)
    man = {l: sorted(f[:-4] for f in os.listdir(os.path.join(ROOT, 'audio', l)) if f.endswith('.mp3')) for l in ('fr', 'es') if os.path.isdir(os.path.join(ROOT, 'audio', l))}
    json.dump(man, open(os.path.join(ROOT, 'audio', 'manifest.json'), 'w'), separators=(',', ':'))
    print('manifest', {l: len(v) for l, v in man.items()})

main()
