Entry #1:

    11/17/2023

    some features i worked on this week with Brandon includes the routers and quieries files related to songs. so the two songs.py files. we worked on Get song and Post song and were able to have it display on FastAPI at localhost:8000/doc. Additionally I added the liking a song and unliking a song as well and shows up in FastAPI. though we are still planning to go through bugs pertaining to the information not showing up on the GET and POST requests. One AH HA moment i had this week was as simple as changing variable names to match names from the models to the routers. the overall ah ha really was understanding how the two communicate and what it does, its nice to get to be able to play with code and see it working,helps learn alot.


Entry #2:

    11/20/2023-11/27/2023

    the features i had worked on this week included backend api and router endpoints. the ones in particular were api function for updating a song and a check that account_id is verified with who posted song_id. some other fixes were to verify that the api function for getting all songs worked and liking and disliking works on teh backend. all the functions above are protected within the newly created routers.songs.py which includes account_id authenticaton which protects these functions to be tampered with only by the account who created them. additionally working with the team to create 1 frontend endpoint to get an idea of how we work, then split off next week and work on our own endpoints. i had a hard time understanding how to implement the protected endpoints, i still have a hard time understanding how to test it within Fastapi, so i am looking forward to working on the front end and testing in a real user setting and seeing what is going on in the console command line by line within the code.