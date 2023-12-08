import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const FollowedUsersList = () => {
  const { account_id } = useParams();
  const [followedAccounts, setFollowedAccounts] = useState([]);

  useEffect(() => {
    const fetchFollowedAccounts = async () => {
      try {
        if (!account_id) {
          console.error('No account_id provided');
          return;
        }

        const authToken = localStorage.getItem('yourAuthToken');

        const response = await fetch(`${process.env.REACT_APP_API_HOST}/followed-accounts/${account_id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Ensure that data.followed_accounts is an array
          const followingIds = data.followed_accounts || data;
          if (Array.isArray(followingIds)) {
            // Fetch account details for each following_id
            const accountsPromises = followingIds.map(async (followingId) => {
              const accountResponse = await fetch(`${process.env.REACT_APP_API_HOST}/api/account/${followingId}`, {
                headers: {
                  'Authorization': `Bearer ${authToken}`,
                },
              });
              if (accountResponse.ok) {
                return accountResponse.json();
              } else {
                console.error(`Failed to fetch account details for account_id ${followingId}`);
                return null;
              }
            });

            // Wait for all account details to be fetched
            const accounts = await Promise.all(accountsPromises);

            // Filter out null values (failed requests) and set the state
            setFollowedAccounts(accounts.filter(account => account !== null));
          } else {
            console.error('Invalid data structure: expected an array for followed_accounts');
          }
        } else {
          console.error('Failed to fetch followed accounts');
        }
      } catch (error) {
        console.error('Error fetching followed accounts:', error);
      }
    };

    fetchFollowedAccounts();
  }, [account_id]);

  const handleUnfollow = async (followingId) => {
    try {
      const token = localStorage.getItem('yourAuthToken');

      if (!token) {
        console.error('Authorization token is missing');
        return;
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const follower_id = decodedToken.account.account_id;

      const requestBody = {
        follower_id: parseInt(follower_id, 10),
        following_id: parseInt(followingId, 10),
      };

      const response = await fetch(`${process.env.REACT_APP_API_HOST}/accounts/${account_id}/unfollow`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Remove the unfollowed account from the state
        setFollowedAccounts(prevAccounts => prevAccounts.filter(account => account.account_id !== followingId));
      } else {
        console.error('Failed to unfollow user');
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <div>
      <h2>Followed Users List</h2>
      {followedAccounts.length > 0 ? (
        <ul>
          {followedAccounts.map((account) => (
            <li key={account.account_id}>
              <p>
                {/* Non-clickable part */}
                Username: {' '}
                {/* Clickable part */}
                <Link to={`/user-profile/${account.account_id}`}>
                  {account.username}
                </Link>
                {' '}
                <button onClick={() => handleUnfollow(account.account_id)}>
                  Unfollow
                </button>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No followed accounts found.</p>
      )}
    </div>
  );
};

export default FollowedUsersList;