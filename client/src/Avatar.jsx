import PropTypes from 'prop-types';

export default function Avatar({userId, username, online}) {
  const colors = ['bg-teal-200', 'bg-red-200', 'bg-green-200', 'bg-purple-200', 'bg-blue-200', 'bg-yellow-200', 'bg-orange-200', 'bg-pink-200', 'bg-fuchsia-200', 'bg-rose-200'];

  // Check if userId and username are defined
  if (!userId || !username) {
    return null; // or some default avatar
  }

  const userIdBase10 = parseInt(userId.substring(10), 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <div className={"w-8 h-8 relative rounded-full flex items-center " + color}>
      <div className="text-center w-full opacity-70">{username[0]}</div>
      {online ? (
        <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
      ) : (
        <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
    </div>
  );
}

Avatar.propTypes = {
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  online: PropTypes.bool,
};

Avatar.defaultProps = {
  online: false,
};
