export const ProfileSection = ({ profile, pictureUrl }) => {
  if (!profile) {
    return (
      <fieldset>
        <legend>Profile:</legend>
        <p>Not logged in</p>
      </fieldset>
    );
  }

  return (
    <fieldset>
      <legend>Profile:</legend>
      <img 
        id="pictureUrl" 
        src={profile.pictureUrl || pictureUrl} 
        alt="Profile Picture"
      />
      <p><b>User ID:</b> {profile.userId}</p>
      <p><b>Display name:</b> {profile.displayName}</p>
      <p><b>Status message:</b> {profile.statusMessage || '-'}</p>
      <p><b>Email:</b> {profile.email || '-'}</p>
    </fieldset>
  );
};
