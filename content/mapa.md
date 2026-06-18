---
title: "Mapa da Viagem"
layout: "single"
weight: 4
---

<style>
.viagem-mapa { max-width: 100%; height: auto; background: #e8f0fe; border-radius: 8px; }
.viagem-mapa .rota { fill: none; stroke: #2B5797; stroke-width: 2.5; stroke-dasharray: 8 4; }
.viagem-mapa .porto { fill: #2B5797; }
.viagem-mapa .porto-label { font-family: 'Source Serif 4', serif; font-size: 11px; fill: #1a1a2e; }
.viagem-mapa .oceano { fill: #d0dff5; }
.viagem-mapa .terra { fill: #f5f0e1; stroke: #c4b89e; stroke-width: 0.5; }
</style>

<svg class="viagem-mapa" viewBox="0 0 900 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa da viagem de Vasco da Gama, 1497–1499">
  <title>Rota da primeira viagem de Vasco da Gama à Índia (1497–1499)</title>

  <!-- Oceano -->
  <rect class="oceano" x="0" y="0" width="900" height="400"/>

  <!-- Massas terrestres simplificadas -->
  <!-- Europa -->
  <path class="terra" d="M100,30 L200,30 L220,80 L200,120 L140,110 L100,80 Z"/>
  <!-- África -->
  <path class="terra" d="M140,110 L200,120 L240,180 L250,280 L220,350 L180,370 L130,340 L100,280 L120,180 Z"/>
  <!-- Ásia (Índia) -->
  <path class="terra" d="M700,50 L780,60 L820,100 L810,180 L750,200 L700,170 L680,120 Z"/>
  <!-- Arábia -->
  <path class="terra" d="M650,100 L680,120 L660,180 L620,160 Z"/>

  <!-- Rota da viagem -->
  <polyline class="rota" points="120,60 180,100 200,160 220,200 200,280 280,230 400,180 500,150 600,130 700,110"/>

  <!-- Portos -->
  <circle class="porto" cx="120" cy="60" r="5"><title>Lisboa — Partida, 8 jul 1497</title></circle>
  <text class="porto-label" x="128" y="55">Lisboa</text>

  <circle class="porto" cx="200" cy="160" r="4"><title>Cabo Verde — jul 1497</title></circle>
  <text class="porto-label" x="208" y="155">Cabo Verde</text>

  <circle class="porto" cx="200" cy="280" r="5"><title>Cabo da Boa Esperança — nov 1497</title></circle>
  <text class="porto-label" x="208" y="275">Cabo da Boa Esperança</text>

  <circle class="porto" cx="280" cy="230" r="4"><title>Mombaça — jan 1498</title></circle>
  <text class="porto-label" x="288" y="225">Mombaça</text>

  <circle class="porto" cx="400" cy="180" r="4"><title>Melinde — abr 1498</title></circle>
  <text class="porto-label" x="408" y="175">Melinde</text>

  <circle class="porto" cx="700" cy="110" r="5"><title>Calecute — Chegada, 20 mai 1498</title></circle>
  <text class="porto-label" x="708" y="105">Calecute</text>

  <!-- Setas de direção -->
  <text x="340" y="195" font-size="14" fill="#2B5797">→</text>
  <text x="500" y="145" font-size="14" fill="#2B5797">→</text>

  <!-- Legenda -->
  <g transform="translate(30, 350)">
    <text class="porto-label" x="0" y="0" font-weight="bold">Rota de Vasco da Gama, 1497–1499</text>
    <line x1="0" y1="14" x2="40" y2="14" stroke="#2B5797" stroke-width="2.5" stroke-dasharray="8 4"/>
    <text class="porto-label" x="48" y="18">Percurso marítimo</text>
  </g>
</svg>

<p class="viagem-nota">Mapa estilizado da rota da primeira viagem de Vasco da Gama. As posições são aproximadas e servem apenas para orientação geográfica do leitor.</p>
