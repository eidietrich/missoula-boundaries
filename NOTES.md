# NOTES

Sketching what this should look like

Minimum viable product —

How is my town doing?:

UI controls

- Pick address
- [x] Pick town (typeahead, pick from cdps) --> Select arbitrary point in town (centroid for now)
- [ ]Layers to show (check boxes, cdps, school districts, counties)
- [x] On map, non-drag click/tap to move interest point, select geographies around it
- [ ]Have a form 'see something you're curious about? Tell us'

GEO display:
- [x] CDP/town boundaries (show incorporated municipalities differently)
- [x] School district boundaries
- [x] County boundary
- [ ] Reservation boundaries
- [ ] Legislative districts (?)

DATA display:
- Population (from census) - current, percent change over decade, chart
    - [x] places/towns (incorporated)
    - [ ] census places (unincorporated)
    - [ ] counties
    - [ ] school district catchment areas?
- School districts (high schools)
    - [x] enrollment history - current, percent change over decade, chart
    - [ ] tax base change
    - [ ]
- [ ] BEA data @ county level (decide what's most relevant - income distribution, wages)
- [ ] Add topology linkages (e.g. 'other towns in this county')

DATA management
- [ ] Clean up scripting process
- [ ] Write tool for adding general data via census API
- [ ] Separate non-downloaded data files from /raw-data, add to git version control

UI Polish
- [ ] Add CSS class handles to react components
- [ ] Style things better
- [ ] Change marker to pin

TODO:
- [x] Set default map display at statewide
- [ ] Polish dropdown selector
    - [ ] Keyboard accessibility
    - [ ] Escape w/out selecting function

DOCUMENTATION
- [ ] Update README.md
- [ ] Push to public github

OPTIMIZATION
- Results component is getting rendered once for every API it calls -- could look at some sort of queuing solution

Extra features
- Show reservation boundaries
- Annotations (e.g. school district merger/consolidations, Anaconda/Butte switching to consolidated govts)
- Add checkboxes for layers to show/hide (reservations, legislative districts)
- Consider separating census places from incorporated municipalities - cleaner from a census data perspective

Features to leave out
- Mouseover effects on towns/counties (too laggy)

Longer-term:
- Use react-router setup to get sharable URLs for app state
- Figure out how to embed in a Wordpress site