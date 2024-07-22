# CPSC 304 Project Breakdown #

## Group Members ##
* k4q8w
* u6u4a
* n0x9v

## Project Description ##
we plan to model a database for the Pokémon franchise (with slight variations 
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
    1. Displays all pokemon and items in tables 
    2. Displays type chart
    3. Ability to search pokemon by name or filter by type (dropdown menu for type?)
    4. Two drop downs that let you enter two types to view effectiveness
    5. Search items by name
6. ***Store Page (Must login to view) - on sidebar***
   1. List all items available in game. Each item has a "get" button (adds to player inventory) 

