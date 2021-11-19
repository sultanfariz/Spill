const Register = () => {
  return (
    <div>
      <h1>Register</h1>
      <form>
        <label>
          Username:
          <input type='text' />
        </label>
        <label>
          Password:
          <input type='password' />
        </label>
        <label>
          Confirm Password:
          <input type='password' />
        </label>
        <button type='submit'>Register</button>
      </form>
    </div>
  );
};

export default Register;
