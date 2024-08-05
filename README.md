# CPSC 304 Project Breakdown #

## Group Members ##
* Lauren
* Dana
* Renbo

## Project Description ##
We plan to model a database for the Pokémon franchise (with slight variations 
to better suit CPSC 304 project requirements), highlighting some key behaviours 
that a player would use while interacting with the game. The purpose of this application 
is to monitor trainers’ progress (including collected pokémon, badges earned, items collected, 
and gym battle records) and the development of their pokémon (such as levels and evolutions).f

### Project Timeline  ###

We have decided to use end-to-end development to construct our timeline so that our group members can all practice
front end and back end skills. Because our application has 6 distinct web pages, it makes sense to split development 
across these pages.

1. Home/landing page (Assigned to: Renbo) - DONE
    1. Front End Needed - July 28
       1. Welcome font and inputs for username and password
       2. Dialog box to create a new account
       3. Buttons for 'login' and 'sign up'
    2. Back End Needed - Aug 2
       1. Set up username-password validation 
       2. Trigger sign up dialog on 'sign up' click
       3. Handle user input on 'login' click

2. Team page (Assigned to: Dana) - DONE
    1. Front End Needed - July 28
       1. Sections titles
       2. Table display for bag, badges, and player pokemon
       3. 'train' and 'release' buttons
       4. Selected pokemon display
    2. Back End Needed - Aug 2
        1. Fill tables with user assets via database
        2. Change displayed pokemon based on what is selected
        3. Fetch data to fill out table on refresh 

3. Pokemon Catching page (Assigned to: Lauren) - DONE
    1. Front End Needed - July 28
        1. Page titles
        2. 'catch now' button
        3. Display for the randomly selected 'caught' pokemon 
    2. Back End Needed - Aug 2
        1. Randomized pokemon selected from pokedex list
        2. Add pokemon to player pokemon once 'caught'
        3. Fetch data to fill out table on refresh

4. Gym Page (Assigned to: Dana) - DONE
    1. Front End Needed - July 28
        1. Page titles 
        2. Gym table 
        3. 'Fight' button 
    2. Back End Needed - Aug 2
        1. Fetch data to fill out table on refresh
        2. Calculate win/loss result randomly

5. Pokedex Page (Assigned to: Lauren) - DONE
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

6. Store Page (Assigned to: Renbo) - DONE
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
7. Build Navigation bar / logic (Lauren) - July 29 - DONE
8. Build .SQL init files (Dana) - July 29 - DONE
9. Final debugging and details (All) - Aug 2-Aug 4 - DONE

### Potential Challenges ###
- None of us have much experience building full stack applications, so we 
anticipate that we will have to problem-solve a lot during this project, particularly dealing with
different users trying to access their accounts through the database
- We may also have some trouble adjusting to the file hierarchies and syntax for a Javascript project, since we
are all new to the language. 

# References #
- https://github.students.cs.ubc.ca/CPSC304/CPSC304_Node_Project
    - server.js, appcontroller.js, appservice.js boilerplate 
    - scripts folder documents 
    - basic setup in /public/scripts.js 
    - .env, .gitignore, .json package, remote-start.sh 
    - utils folder/file 
- https://pixabay.com/
    - Used to source svg files for diaply on our webpages
- https://stackoverflow.com/questions/46718772/how-i-can-sanitize-my-input-values-in-node-js
    - Code not used directly, but used to help us understand how to sanitize inputs
- https://node-oracledb.readthedocs.io/en/latest/user_guide/bind.html#sqlwherein
    - Used to help us understand how binding variables work with SQL
- https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
    - Used to help us understand usage of SessionStorage for logins and storing usernames


