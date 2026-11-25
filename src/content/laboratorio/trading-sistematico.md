---
title: Trading sistemático, en paper y con la regla por delante
description: Qué es una regla que se puede escribir, por qué el paper existe y cómo se acota el riesgo sin convertir el texto en una estrategia.
pubDate: 2026-11-03
minutes: 10
kicker: Riesgo
topics:
  - Paper trading
  - Riesgo
  - Sistemas
tools:
  - tamano-posicion
  - volatilidad-drawdown
---

Sistemático quiere decir que la decisión cabe en una regla anterior al resultado. Si la regla se reescribe después de ver el día, no era una regla: era un relato. El relato siempre gana, porque se adapta.

El paper existe para separar esas dos cosas sin pagar la matrícula en euros. El precio puede ser real. La cuenta no lo es. Eso deja fuera, y hay que decirlo, todo lo que el paper no siente: el miedo a apretar, la racha más larga que tu muestra, el spread que se abre cuando de verdad quieres salir. Un paper bonito no es un permiso.

## Lo que se escribe antes

- La entrada, la salida y el motivo para no operar.
- El riesgo de una operación como porcentaje del equity de la prueba, no como «lo que me parece».
- El techo de la semana. Tocado el techo, se para.
- Los costes, aunque nadie los cobre en la simulación.
- La fecha en la que se permite cambiar la regla.

El tamaño sale de una división. Si arriesgas el 1% de 10.000 hasta un stop que está a 5 de una entrada a 100, caben 20 unidades y el nocional es 2.000. La [herramienta](/laboratorio/herramientas/tamano-posicion/) hace eso y, si hay objetivo, el R:R y la tasa de acierto a la que la esperanza sería cero. Una R de 2 no se equilibra al 50%. Se equilibra en torno a uno de cada tres. Es aritmética. No es una tasa que el mercado te deba.

La otra herramienta mira una serie o un modelo de volatilidades. El drawdown máximo de la serie es el peor valle desde un pico, compuesto. Sirve para preguntarte si aguantarías ese número. No sirve para predecir el siguiente.

## Lo que un bot no arregla

Un bot ejecuta. No inventa un borde. Si la regla está sobreajustada a un tramo, el bot la ejecutará con disciplina, que es la peor cualidad posible aplicada a una regla mala. Por eso no publico código, ni una estrategia, ni un bróker. El flujo operativo, en versión corta y con los mismos límites, está en [Probar un bot en modo paper](/workflows/bot-en-paper/).

CGA no gestiona cuentas y no manda señales. Si esta página te suena a un servicio, reléela. Es una clase de método.
