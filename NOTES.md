# NOTES

Sketching what this should look like

Minimum viable product —

How is my town doing?:

UI controls

- Pick address
- Pick town (typeahead, pick from cdps) --> Select arbitrary point in town (centroid for now)
- Layers to show (check boxes, cdps, school districts, counties)
- On map, Mouseover/select geographies
    - Move interest point based on non-drag click/tap, select geographies around it
- Have a form 'see something you're curious about? Tell us'

GEO display:
- CDP/town boundaries (show incorporated municipalities differently)
- School district boundaries
- County boundary

DATA display:
- Population (from census) - current, percent change over decade, chart
- School district enrollment history - current, percent change over decade, chart
- BEA data @ county level (decide what's most relevant - income distribution, wages)

--> Initially, wire something together so selecting an interest point pulls up data for town/school district/county

Q's - What does back-end look like here? This is probably a bit too sophisticated to do w/ just flat files. Set up Postgres back end (separate out as an API)



TODO:
- Refine mapbox default style to show/hide certain boundaries better (and avoid unwanted pointer-styles)


Longer-term:
- Use react-router setup to get sharable URLs for app state
- Figure out how to embed in a Wordpress site
- Current setup converts multi-part geographies (e.g. cities) into piecemeal polygons so DistrictMap doesn't choke on them. This is going to be non-ideal long-run.