const Error = ({ message }) => {
  const errorMessage = typeof message === 'object' && message !== null 
    ? message.message || JSON.stringify(message) 
    : message;
    
  return (
    <div className="text-sm text-red-500 mt-1">
      {errorMessage}
    </div>
  );
};

export default Error;
