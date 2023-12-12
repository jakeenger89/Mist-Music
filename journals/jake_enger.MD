Entry #1:

    11/17/2023

    some features i worked on this week with Brandon includes the routers and quieries files related to songs. so the two songs.py files. we worked on Get song and Post song and were able to have it display on FastAPI at localhost:8000/doc. Additionally I added the liking a song and unliking a song as well and shows up in FastAPI. though we are still planning to go through bugs pertaining to the information not showing up on the GET and POST requests. One AH HA moment i had this week was as simple as changing variable names to match names from the models to the routers. the overall ah ha really was understanding how the two communicate and what it does, its nice to get to be able to play with code and see it working,helps learn alot.


Entry #2:

    11/20/2023-11/27/2023

    the features i had worked on this week included backend api and router endpoints. the ones in particular were api function for updating a song and a check that account_id is verified with who posted song_id. some other fixes were to verify that the api function for getting all songs worked and liking and disliking works on teh backend. all the functions above are protected within the newly created routers.songs.py which includes account_id authenticaton which protects these functions to be tampered with only by the account who created them. additionally working with the team to create 1 frontend endpoint to get an idea of how we work, then split off next week and work on our own endpoints. i had a hard time understanding how to implement the protected endpoints, i still have a hard time understanding how to test it within Fastapi, so i am looking forward to working on the front end and testing in a real user setting and seeing what is going on in the console command line by line within the code.


Entry #3:

    11/28/2023-12/4/2023

    The features i implemented for this week were getting the front end view profile page working, the list all songs page working, and the update your song and delete the song all working on the front end no errors. the only error we have is relating an album to a song when creating but it does not stop you from uploading a song because we want them to have the ability to add them to an album or not. as well, we have a system where authenticator tracks which songs you have liked, you cannot liked more than once ever regardless of login session. upon deletion of a song all the likes and information regarding it go with it. and today 12/4/2023 i finally got the list view for all the songs a user liked working on the account.js i will like to have a separate page for it or just leave to help populate the home account page. some blockers this week and the big push for this week is finding a way to implement music to the site. right now i have a table created, i beleive i can store it within the server but i need to see how we are going to do that when launching, otherwise we will have to learn to utilize an api.


Entry #4:

    12/5/2023- 12/11/2023

    The last week! :( :), this last week included alot of stress and drive to get alot of things done. I really didnt understand how the backend and frontend communicated until i really got into implementing some of the features i origionally wanted to add.
        things i implemented this week:
            liked songs page
            playing music on the site
            an individual songs page
            worked on implementing the ability to follow users
            unit test
            css
            and a few other things
    getting music playing on the site just required a proper url and utilizing the audio tag within the code to pull up a sound player, which is pretty much what we were after outside using an API for other peoples music. there was big panic for me in terms of whether or not we would get it done, i feel like i acomplished alot, but not as much as i had hoped for nor origionally planned, but coming out of this now theres alot more aspects i want to learn and find myself enjoying. like the backend now. only blocker really this weekend was issues with css/tailwind conflicting, kinda scrambled to throw some sort of css on it and didnt put too much time into learning tailwind. other minor things i wish i knew: include providing more details for certain pages, like if i were to include the account_id in song out as a not null, i could then access it easier on the song page and utlize my like and dislike feature there. so all in all im happy with it but theres some user functionality that i feel i just didnt prioritize time for/realize the time i needed for it.