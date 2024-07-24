# CPSC 304 Project Breakdown #

## Group Members ##
* k4q8w
* u6u4a
* n0x9v

## Project Description ##
This is renbo testing. We plan to model a database for the Pokémon franchise (with slight variations 
to better suit CPSC 304 project requirements), highlighting some key behaviours 
that a player would use while interacting with the game. The purpose of this application 
is to monitor trainers’ progress (including collected pokémon, badges earned, items collected, 
and gym battle records) and the development of their pokémon (such as levels and evolutions).



### Elements required in application (Brainstorm) ###

1. ***Landing page*** 
   1. Login button
   2. Create account button
2. ***Team page (Must login to view) - on sidebar***
   1. Display team
      1. Should have a "train" (level up) and "release" (delete) button for each pokemon
   2. Display badges
   3. Display items
3. ***Pokemon Catching Page (Must login to view) - on sidebar***
   1. Catch button to randomly get pokemon 
   2. display pokemon when "catch is pressed"
4. ***Gym Page (Must login to view) - on sidebar***
   1. Displays all gyms with their attributes
   2. Challenge button. If you press it, a new gym challenge + battle is made and stored in database. 
      The user sees whether they win or lose. If they win, the appropriate badge is added to the badge table
5. ***Pokedex Page (Must login to view) - on sidebar***
    1. Displays all pokemon in tables 
    2. Displays evolution chart
    3. Ability to search pokemon by name or filter by type (dropdown menu for type)
    4. Two drop downs that let you enter two types to view effectiveness
6. ***Store Page (Must login to view) - on sidebar***
   1. List all items available in game. Each item has a "get" button (adds to player inventory) 

### Project Timeline  ###

We have decided to use end-to-end development to construct our timeline so that our group members can all practice
front end and back end skills. Because our application has 6 distinct web pages, it makes sense to split development 
across these pages.

1. Home/landing page (Assigned to: Renbo)
    1. Front End Needed - July 28
       1. Welcome font and inputs for username and password
       2. Dialog box to create a new account
       3. Buttons for 'login' and 'sign up'
    2. Back End Needed - Aug 2
       1. Set up username-password validation 
       2. Trigger sign up dialog on 'sign up' click
       3. Handle user input on 'login' click

2. Team page (Assigned to: Dana)
    1. Front End Needed - July 28
       1. Sections titles
       2. Table display for bag, badges, and player pokemon
       3. 'train' and 'release' buttons
       4. Selected pokemon display
    2. Back End Needed - Aug 2
        1. Fill tables with user assets via database
        2. Change displayed pokemon based on what is selected
        3. Fetch data to fill out table on refresh 

3. Pokemon Catching page (Assigned to: Lauren)
    1. Front End Needed - July 28
        1. Page titles
        2. 'catch now' button
        3. Display for the randomly selected 'caught' pokemon 
    2. Back End Needed - Aug 2
        1. Randomized pokemon selected from pokedex list
        2. Add pokemon to player pokemon once 'caught'
        3. Fetch data to fill out table on refresh

4. Gym Page (Assigned to: Dana)
    1. Front End Needed - July 28
        1. Page titles 
        2. Gym table 
        3. 'Fight' button 
    2. Back End Needed - Aug 2
        1. Fetch data to fill out table on refresh
        2. Calculate win/loss result randomly

5. Pokedex Page (Assigned to: Lauren)
    1. Front End Needed - July 28
        1. Titles and section titles
        2. Tables for Pokemon and evolutions
        3. input bars for pokemon and type effectiveness
        4. Drop down menu to filter pokemon by type
        5. Special display for currently selected pokemon 
    2. Back End Needed - Aug 2
        1. Fetch data to fill out table on refresh
        2. Refresh results based on filters and searches
        3. Query to return type effectiveness when 'get effectiveness' is clicked

6. Store Page (Assigned to: Renbo)
    1. Front End Needed - July 28
        1. Titles and section titles
        2. Table for items available in game
        3. Input for search bar
        4. Special display for currently selected item 
    2. Back End Needed - Aug 2
        1. Fetch data to fill out table on refresh
        2. Refresh results based on search
        3. Add item to trainer bag on 'buy' click
        4. Special display based on what is currently selected 
  
    ***MISC.***
7. Build Navigation bar / logic (Lauren) - July 29
8. Build .SQL init files (Dana) - July 29
9. Final debugging and details (All) - Aug 2-Aug 4
        
### Potential Challenges ###
- None of us have much experience building full stack applications, so we 
anticipate that we will have to problem-solve a lot during this project, particularly dealing with
different users trying to access their accounts through the database
- We may also have some trouble adjusting to the file hierarchies and syntax for a Javascript project, since we
are all new to the language. 

# References #
- server, appcontroller, appservice boilerplate
- scripts folder (all)
- basic setup in /public/scripts.js
- .env, .gitignore, .json package, remote-start.sh
- utils folder/file


