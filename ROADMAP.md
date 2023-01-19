# Gamedex

Tech stack:
- sveltekit
    - with lib to handle forms
    - zod for validation
    - typescript
    - vitest
    - infinite scrolling lib
    - tailwind
- trpc
- db
    - mysql
    - local development on docker
    - production hosted on planetscale
    - prisma

## V 0.1.0
- Games
    - Create
    - List
    - Delete
    - select a single one

## V 0.2.0
- single user login with jwt
- edit games
  
## V 0.3.0
- dark mode
- filter list
- sort list

## V 0.4.0
- add game dlcs
- add game useful links
- add notes
- add events

## V 0.5.0
- possibility to use dates like "2023", "1st quarter 2023", "summer 2021", "september 2024"
- add total achievement count
- add achieved achievement count
- add completion %

## V 0.6.0
- add general events (like e3, ...) with date, description, ...
  
## V 0.7.0
- rework home:
    - bottom right: calendar with next events, game releases, dlc releases, game events (calendar shows their pic?)
    - bottom left: infinite scrolling list of upcoming games (even the ones with "unsure" dates, like "1st quarter 2023")
    - top: last visited games
