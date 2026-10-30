#!/usr/bin/env python3
"""Construye La Expedición Pitágoras a partir de src/.

Salidas:
  dist/index.html                  -> documento completo (GitHub Pages / abrir sin conexión)
  dist/pitagoras.artifact.html     -> para publicar como artifact (sin <!doctype>)
  dist/test.html                   -> igual que index.html pero exporta datos internos para las pruebas
"""
import os, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
read = lambda *a: open(P(*a), encoding='utf-8').read()
css = read('src', 'style.css'); fonts = read('src', 'fonts.css'); body = read('src', 'body.html')
js = '\n'.join(open(f, encoding='utf-8').read() for f in sorted(glob.glob(P('src', 'js', '*.js'))))
TEST = ("\nwindow.__P={get S(){return S},set S(v){S=v},get R(){return R},set R(v){R=v},get L(){return L},CH,ORDER,SCENES,DILEMMAS,SAGES,RELICS,TOPICS,WORDS,EXPS,INTROS,LINES,CAST,CHARS,"
        "startRun,next,answer,proofPick,go,render,setLang,playScene,portrait,sceneBG,genTopic,checkAnswer,diagnose,saveCode,readCode,T,t,plain,voKey,dropName,speakable,sageSpeech,cardSay,"
        "buildC1,buildC3,buildC4,buildC5,buildC7,buildC8,buildC9,buildC10,buildDaily,buildExam,nextBoss,nextSurvival,nextBridge,finish,calcEval,mkWord,PROLOGUE,SP,TALK,isUnlocked,"
        "qRootPerfect,qRootBetween,qRootSum,qIrrational,qSqOfRoot,qRootApprox,qDiagSquare,qSquareFromArea,qRightAt,qWhichTool,qCarpenter,qProofRecip,qProofDirect,qCosId,qCosValue,qCosAdj,qCosHyp,qCosAngle,qCosImpossible,qCosCtx,qGridDist,qGridMap,qBoxFace,qBoxSpace,qBoxFit,qCube,qCircle,qCircleWhy,voiceLines};\n")
def page(test=False):
    script = "<script>\n(function(){'use strict';\n" + js + (TEST if test else '') + "\n})();\n</script>\n"
    return '<title>La Expedición Pitágoras</title>\n<style>\n' + fonts + '\n' + css + '</style>\n' + body + '\n' + script
def full(test=False):
    return ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="theme-color" content="#15121c">\n'
            '<meta name="description" content="La Expedición Pitágoras / L’Expédition Pythagore: un juego para dominar el teorema de Pitágoras, su recíproco, las raíces, el coseno y las distancias.">\n'
            + page(test).replace('<title>La Expedición Pitágoras</title>\n', '<title>La Expedición Pitágoras</title>\n</head>\n<body>\n', 1) + '</body>\n</html>\n')
os.makedirs(P('dist'), exist_ok=True)
for name, html in {'index.html': full(), 'pitagoras.artifact.html': page(), 'test.html': full(True)}.items():
    open(P('dist', name), 'w', encoding='utf-8').write(html)
    print(f'{name:26s} {len(html.encode())/1024:8.1f} KB')
