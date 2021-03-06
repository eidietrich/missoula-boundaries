# NOTES

Sketching what this should look like

Minimum viable product —

How is my town doing?:



## TODOS:

Frontend
- Look at nested layer display in dropdown
- Set up address input box to display current address?
- Add map zoom controls
- Fix map extent fitting wackiness (e.g. bad zoom on mobile)
- Fine-tune map interaction (e.g. animations between different views)
- Shift away from GeoJSON overlay for highlight shapes (inefficient rendering)

Data management/deployment
- Refactor frontend to Mobx state management
- Figure out how to manage deployment config more elegantly
- Look at webpack production build optimizations
- Automate build/update process - include staging server --> get as commands in package.json

UI controls

- Pick address
- [x] Pick town (typeahead, pick from cdps) --> Select arbitrary point in town (centroid for now)
- [x]Layers to show (check boxes, cdps, school districts, counties)
- [x] On map, non-drag click/tap to move interest point, select geographies around it
- [x]Have a form 'see something you're curious about? Tell us'
- [ ] Set up check system for picking layer variables, e.g. town --> population, metric-b, metric-c


GEO display:
- [x] CDP/town boundaries (show incorporated municipalities differently)
- [x] School district boundaries
- [x] County boundary
- [x] Reservation boundaries
- [ ] Legislative districts (not default)
- [ ] Elem district boundaries

DATA display:
- Population (from census) - current, percent change over decade, chart
    - [x] places/towns (incorporated)
    - [ ] census places (unincorporated)
    - [x] counties
    - [ ] school district catchment areas?
- School districts (high schools)
    - [x] enrollment history - current, percent change over decade, chart
    - [x] tax base change
    - [ ] general fund budget
- [ ] BEA data @ county level (decide what's most relevant - income distribution, wages)
    - [x] per-capita income
    - [ ] relative importance of different industries
    - [ ] employment trend in most important industries
- [ ] Add topology linkages (e.g. 'other towns in this county')
- [ ] Fine-tune chart formatting --> Look at Semiotic charts https://emeeks.github.io/semiotic/#/semiotic/annotations
- [ ] Set up system for customizing charts on a per-metric basis
- [ ] Figure out how to manage annotations

DATA management
- [x] Clean up scripting process
- [ ] Write tool for adding general data via census
- [ ] Refactor state management for scalability - use mobx or redux --> Need to do a tutorial first
- [ ] Standardize column names to allow server code refactoring
- [ ] Figure out how to deal w/ inflation adjustments
- [x] Separate non-downloaded data files from /raw-data, add to git version control
- [ ] Set up lazy load for layer data --> load only initially displayed layers first?

UI Polish
- [x] Add CSS class handles to react components
- [ ] Style things better
- [x] Change marker to pin


TODO:
- [x] Set default map display at statewide
- [ ] Polish dropdown selector
    - [ ] Keyboard accessibility
    - [x] Escape w/out selecting function


DOCUMENTATION
- [x] Update README.md
- [ ] Push to public github

OPTIMIZATION
- Results component is getting rendered once for every API it calls -- could look at some sort of queuing solution

Extra features

- Annotations (e.g. school district merger/consolidations, Anaconda/Butte switching to consolidated govts)
- Add checkboxes for layers to show/hide (reservations, legislative districts)
- Consider separating census places from incorporated municipalities - cleaner from a census data perspective

Features to leave out
- Mouseover effects on towns/counties (too laggy)

Longer-term:
- Use react-router setup to get sharable URLs for app state
- Figure out how to embed in a Wordpress site

DEPLOYMENT
Deployment process (work in progress:
Using Digital Ocean server
1. Build production version of front end app
2. Set up digital ocean droplet - install node, Nginx etc. (watch version on nodejs so it doesn't break the express server being used by the API)
3. Deploy via clone from github repo (TODO: Find a more elegant way)
4. Transfer /build-app/ directory to /var/www/mt-town-vitality so Nginx server can find it
4. Set up Postgres server
4. Install PM2 for server task handling
5. Get .env configured
6. Run Express API server ->


TODO - figure out how to wrap this in a deployment script for convenience/documentation