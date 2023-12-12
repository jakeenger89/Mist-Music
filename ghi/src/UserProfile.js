import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./userprofile.css";

const UserProfile = () => {
  const { account_id } = useParams();
  const following_id = account_id;
  const [userData, setUserData] = useState(null);
  const [likedSongs] = useState([]);
  const [postedSongs, setPostedSongs] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [followedOnce, setFollowedOnce] = useState(false);
  const [profile_picture_url] = useState(
    "https://img.freepik.com/free-photo/user-profile-icon-front-side-with-white-background_187299-40010.jpg?size=626&ext=jpg&ga=GA1.1.733290954.1702167185&semt=ais"
  );
  const [banner_url] = useState(
    "https://cdn.pixabay.com/photo/2016/02/03/08/32/banner-1176676_1280.jpg"
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("yourAuthToken");
    if (storedToken) {
      const decodedToken = JSON.parse(atob(storedToken.split(".")[1]));
      const {
        account: { account_id },
      } = decodedToken;
      setLoggedInUserId(account_id);
    }

    // Clear local storage for follow status when the component mounts
    localStorage.removeItem(`followStatus_${loggedInUserId}_${following_id}`);

    const fetchData = async () => {
      try {
        const [userDataResponse, postedSongsResponse] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_HOST}/api/account/${account_id}`),
          fetch(`${process.env.REACT_APP_API_HOST}/user-songs/${account_id}`),
        ]);
        if (userDataResponse.ok) {
          const userData = await userDataResponse.json();
          setUserData(userData);
        } else {
          console.error("Failed to fetch user data");
        }
        if (postedSongsResponse.ok) {
          const data = await postedSongsResponse.json();
          setPostedSongs(data.songs);
        } else {
          console.error("Failed to fetch posted songs");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Check server for follow status
    const checkFollowingStatus = async () => {
      try {
        const authToken = localStorage.getItem("yourAuthToken");

        if (authToken) {
          const decodedToken = JSON.parse(atob(authToken.split(".")[1]));
          const follower_id = decodedToken.account.account_id;

          const response = await fetch(
            `${process.env.REACT_APP_API_HOST}/following-status/${follower_id}/${following_id}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setIsFollowing(data.is_following);
          } else {
            console.error("Failed to fetch following status");
          }
        }
      } catch (error) {
        console.error("Error checking following status:", error);
      }
    };

    checkFollowingStatus();
  }, [account_id, loggedInUserId, following_id]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("yourAuthToken");

      if (!token) {
        console.error("Authorization token is missing");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const follower_id = decodedToken.account.account_id;

      const requestBody = {
        follower_id: parseInt(follower_id, 10),
        following_id: parseInt(account_id, 10),
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/accounts/${account_id}/follow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (response.ok) {
        setIsFollowing(true);
        setFollowedOnce(true);
        // Save follow status to local storage
        localStorage.setItem(
          `followStatus_${loggedInUserId}_${following_id}`,
          true
        );
        localStorage.setItem(
          `followedOnce_${loggedInUserId}_${following_id}`,
          true
        );
      } else {
        console.error("Failed to follow user");
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  return (
    <div className="profile">
      {userData && (
        <div className="container">
          <div className="banner-image">
            <img src={userData.banner_url || banner_url} alt="Banner" />
          </div>
          <div className="profile-image-container">
            <img
              src={userData.profile_picture_url || profile_picture_url}
              alt="Profile"
              className="profile-pic"
            />
          </div>
          <h1 className="username">{userData.username}'s Profile</h1>
          <div className="user-links">
            <Link
              className="profile-link"
              to={`/user-liked-songs/${account_id}`}
            >
              <h4>Liked Songs</h4>
            </Link>
          </div>
          <ul>
            {likedSongs.map((song) => (
              <li key={song.song_id}>
                <Link to={`/songs/${song.song_id}`}>{song.name}</Link>
              </li>
            ))}
          </ul>
          <h4>Posted Songs</h4>
          <ul>
            {postedSongs.map((song) => (
              <li key={song.song_id}>
                <Link to={`/songs/${song.song_id}`}>{song.name}</Link>
              </li>
            ))}
          </ul>
          <div className="followbtn">
            {!isFollowing && (
              <button onClick={handleFollow} disabled={followedOnce}>
                Follow
              </button>
            )}
            {isFollowing && <p>Following</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
