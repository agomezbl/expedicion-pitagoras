/* =========================================================
   IDIOMA: francés (collège) y español (ESO)
   t('texto fr','texto es') para cadenas en el código; T({fr,es}) para datos.
   ========================================================= */
let L='es';
const t=(fr,es)=>L==='fr'?fr:es;
const T=o=>o==null?'':typeof o==='string'||typeof o==='number'?String(o):(o[L]!=null?o[L]:(o.es!=null?o.es:''));
const tf=(fr,es)=>({fr,es});
/* vocabulario del teorema */
const W={
  get hyp(){return t('hypoténuse','hipotenusa');},get Hyp(){return t('Hypoténuse','Hipotenusa');},
  get cat(){return t("côté de l'angle droit",'cateto');},get cats(){return t("côtés de l'angle droit",'catetos');},
  get Cat(){return t("Côté de l'angle droit",'Cateto');},get Cats(){return t("Les côtés de l'angle droit",'Los catetos');},
  get right(){return t('angle droit','ángulo recto');},get rectT(){return t('triangle rectangle','triángulo rectángulo');},
  get sqrt(){return t('racine carrée','raíz cuadrada');},
};
