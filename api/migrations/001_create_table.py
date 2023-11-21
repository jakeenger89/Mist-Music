steps = [
    [
    """
    CREATE TABLE account (
        account_id SERIAL PRIMARY KEY NOT NULL,
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
    DROP TABLE account;
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
    DROP TABLE songs;
    """
    ],

    [
    """
    CREATE TABLE liked_songs (
    account_id INTEGER REFERENCES account(account_id),
    song_id INTEGER REFERENCES songs(song_id),
    PRIMARY KEY (account_id, song_id)
    );
    """,

    """
    DROP TABLE liked_songs;
    """
    ],

    [
    """
    CREATE TABLE merchandise (
        item_id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(100) NOT NULL,
        image_url VARCHAR(1000) NOT NULL,
        price SMALLINT NOT NULL,
        size VARCHAR(30),
        description VARCHAR(1000),
        quantity SMALLINT
    );

    """,
    """
    DROP TABLE merchandise;
    """
    ],

    [
    """
    CREATE TABLE albums (
        album_id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(100) NOT NULL,
        artist VARCHAR(50) NOT NULL,
        genre VARCHAR(50) NOT NULL,
        release_date DATE NOT NULL,
        cover_image_url VARCHAR(1000) NOT NULL
    );

    """,

    """
    DROP TABLE albums;
    """
    ]
]
