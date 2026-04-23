export const FriendshipSection = ({ friendship }) => {
  if (!friendship) {
    return null;
  }

  let message = "You and our chatbot are friend";
  if (!friendship.friendFlag) {
    message = <a href="https://line.me/R/ti/p/@837ircms">Follow our chatbot now!</a>;
  }

  return (
    <fieldset>
      <legend>Friendship:</legend>
      <p id="friendship"><b>Friendship:</b> {message}</p>
    </fieldset>
  );
};
