steps = [
    [
        """
        CREATE TABLE account (
            account_id SERIAL PRIMARY KEY NOT NULL,
            username VARCHAR(20) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            first_name VARCHAR(50),
            last_name  VARCHAR(50),
            profile_picture_url VARCHAR(1000),
            banner_url VARCHAR(1000),
            signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            currency INT DEFAULT 0
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
            release_date VARCHAR(20),
            length INTEGER,
            bpm VARCHAR(4),
            rating INTEGER,
            account_id INTEGER REFERENCES account(account_id) ON DELETE CASCADE
        );

        """,

        """
        DROP TABLE songs;
        """
    ],

    [
        """
        CREATE TABLE liked_songs (
        account_id INTEGER REFERENCES account(account_id) ON DELETE CASCADE,
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
    ],

    [
        """
        CREATE TABLE customer (
            order_id SERIAL PRIMARY KEY NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100),
            address VARCHAR(150) NOT NULL,
            city VARCHAR(100) NOT NULL,
            zipcode INT NOT NULL,
            state VARCHAR(20) NOT NULL,
            fulfilled BOOL DEFAULT FALSE
        );
        """,

        """
        DROP TABLE customer;
        """
    ]
]
