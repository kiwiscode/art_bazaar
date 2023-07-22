function Signed() {
  const messageStyle = {
    fontSize: "18px",
    color: "#1a1a1a",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f1c40f",
    borderRadius: "5px",
  };
  return (
    <div>
      <p style={messageStyle}>
        Email verification link has been sent to your email address. Please
        check your inbox and follow the instructions to verify your account.
      </p>
    </div>
  );
}

export default Signed;
