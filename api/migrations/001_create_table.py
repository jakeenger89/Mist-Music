steps = [
    [
    """
    CREATE TABLE users (
        user_id SERIAL PRIMARY KEY NOT NULL,
        username VARCHAR(20) UNIQUE NOT NULL,
        email_address VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        first_name VARCHAR(50),
        last_name  VARCHAR(50),
        profile_picture_url VARCHAR(1000),
        banner_url VARCHAR(1000),
        signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    """,

    """
    DROP TABLE users;
    """
    ],

    [
    """
    CREATE TABLE songs (
        song_id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        artist VARCHAR(50),
        album VARCHAR(100),
        genre VARCHAR(50),
        release_date DATE,
        length INTERVAL,
        bpm VARCHAR(4),
        rating INTEGER
    );

    """,

    """
    DROP TABLE users;
    """
    ]
]
