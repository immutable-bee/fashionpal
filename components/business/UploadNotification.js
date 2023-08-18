const UploadNotification = ({ title, numberOfOtherBooks }) => {
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-green-400 text-white rounded-lg shadow-lg transition-opacity duration-500">
      {numberOfOtherBooks > 0 ? (
        <p>
          {title} & {numberOfOtherBooks} others successfully uploaded
        </p>
      ) : (
        <p>{title} successfully uploaded</p>
      )}
    </div>
  );
};

export default UploadNotification;
