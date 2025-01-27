---
layout: sub-traffictype
permalink: /en/railway-traffic/ruma/
section: Tietolähteet
traffictypes: Rataliikenne
searchable: true
hero-image: rail
title: RUMA
lang: en
ref: ruma
intro: RUMA system data
---

The RUMA system is used to design and implement track works using track work
notifications. RUMA is also used to report traffic restrictions with traffic
restriction notifications.

# Track work notification

In addition to basic information the notification contains the track work's
location(s). Below is a description of the notification structure.

```
Track work notification
│
└───Work part
    │   Index: 1
    │   Starting day: 12.3.2020
    │
    └───Location: Tampere
        │   Operating point or section between operating points: 1.2.246.586.1.39.119274
        │   Type: WORK
        │
        └───Identifier range: TPE V0070 - TPE V0060 (008)
        │   │
        │   └───Element range
        │       │   Element 1: 1.2.246.586.1.24.118652
        │       │   Element 2: 1.2.246.586.1.24.118640
        │       │   Track: 1.2.246.586.1.44.121862
        │       │
        │       └───Specifier
        │               Infra type: Balise
        │               Infra-id: 1.2.246.586.1.11.1036487
        │
        └───Identifier range TPE V0041
               Elementti: 1.2.246.586.1.24.118630
```

## Work part

Describes a logical part of a track work. Consists at least of a single
location. Work parts are numbered (index).

# Traffic restriction notification

In addition to basic information the notification contains a possible link to a
track work notification. The notification also has a restriction type, possible
types are:

- Closed from traffic
- Closed from electric rolling stock
- Temporary speed limit
- Max axle weight
- ATP construction zone
- Switch locked
- Fire work danger zone

A traffic restriction notification references railway infrastructure directly
and not through work parts.

# Location of traffic work or restriction

Below is a description of concepts with which traffic work notifications and
traffic restriction notifications reference railway infrastructure.

## Location

Always related to an operating point or a section between operating points. The
location type describes the type of work: allowed values are **WORK, FIREWORK,
SPEED_LIMIT**. If the location doesn't contain any identifier ranges, the work
location is the whole operating point/section.

## Identifier range

Describes either:

- An area between two elements. This area consists of one or multiple element
  ranges.\
  OR
- The allocation of a switch. An identifier range with a switch and no element
  ranges implies that the switch is not usable for traffic.\
  OR
- Some ambiguous route between two elements (element pair).

## Element range

Element ranges form an unambiguous route between two elements (multiple routes
could be possible otherwise). Elements can be only _limiting_ elements of a
certain type: **limiting signal, switch, buffer, stop board, operating point
boundaries, traffic management boundaries**.

## Specifier

Specifier designates a non-limiting element inside an element range. Allowed
specifier types are: **level crossing, balise, non-limiting signal**.

### Limiting signal types

Below are Infra-API signal types designated in RUMA as limiting. Other signal
types are non-limiting.

```
pa, pa2, pav, ps, ps2, ps2v, psv, ra, rp, su, rd, y4, ye, ys, yse, ysj, ysje, ysjv, ysv, ysve, yv
```

[RUMA system page](https://fintraffic.fi/fi/finrail/ruma) (in Finnish)
