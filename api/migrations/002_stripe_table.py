steps = [
    [
        """
        CREATE TABLE product (
            product_id SERIAL PRIMARY KEY NOT NULL,
            price INT
        );

        """,
        """
        DROP TABLE account;
        """,
    ],
]
