FG - First Game
===================

First experience in Game development

----------

API
-------------

This is basic api design.

> **Note:**

> This is BETA version.


#### Figure

Figure is basic object to paint elements or any figures group. The top level figure is a global game scene and contains all other elements.

get()
> return map of contains elements

add(element, position)
> add element/figure by the position

moveTo(element, position)
> move element to new position

moveByVector(element, vector)
> move element to new position by the vector


#### Map

Map contains rows and cells.

get()
> return map of contains elements

get(position)
> return found element by position

getPosition(element)
> return element position

isImpassableCell(position)
> return impassable value of element per the position

add(element, position)
> add element/figure by the position

moveTo(element, position)
> move element to new position

moveByVector(element, vector)
> move element to new position by the vector

