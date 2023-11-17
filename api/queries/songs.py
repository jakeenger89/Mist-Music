

class SongQueries:
    def get_songs(self):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    Select info here
                    """
                )
                songs = []
                rows = cur.fetchall()
                for row in rows:
                    song =
                    songs.append(song)
                return songs



    def like_song(self, song_id, user_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    #like a song
                    cur.execute(
                        """
                        INSERT INTO song_likes (user_id, song_id)
                        VALUES (%s, %s)
                        """,
                        [user_id, song_id],
                    )
                    return True
                except Exception as e:
                    # Handle errors (e.g., duplicate likes)
                    print(e)
                    return False

    def unlike_song(self, song_id, user_id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    # Delete a liked song
                    cur.execute(
                        """
                        DELETE FROM song_likes
                        WHERE user_id = %s AND song_id = %s
                        """,
                        [user_id, song_id],
                    )
                    return True
                except Exception as e:
                    # Handle errors (e.g., if the like doesn't exist)
                    print(e)
                    return False