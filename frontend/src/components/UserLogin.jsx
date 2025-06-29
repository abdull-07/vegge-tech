import React from 'react';
import { useAppContext } from '../context/AppContext';

const UserLogin = () => {
  const [state, setState] = React.useState('login');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {setShowUserLogin, setUser} = useAppContext();


  const submitHandler = async (event) => {
   event.preventDefault();
   setUser({ email:"text@veggetech.com", name:"VeggeTech", password:"Vegge_Tech_20" });
   setShowUserLogin(false);
  }
 
  return (
    <div onClick={()=>setShowUserLogin(false)} className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-primary z-50">
      <form onSubmit={submitHandler} onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-background">
        <p className="text-2xl font-medium m-auto text-text">
          <span className="text-secondary">User</span> {state === 'login' ? 'Login' : 'Sign Up'}
        </p>

        {state === 'register' && (
          <div className="w-full">
            <p className="text-text text-sm">Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-secondary/30 bg-background text-primary rounded w-full p-2 mt-1 border-secondary focus:border-primary "
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p className="text-text text-sm">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-300 bg-background text-primary rounded w-full p-2 mt-1 border-secondary focus:border-primary "
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p className="text-text text-sm">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="type here"
            className="border border-gray-300 bg-background text-primary rounded w-full p-2 mt-1 border-secondary focus:border-primary "
            type="password"
            required
          />
        </div>

        <p className="text-sm text-text-light">
          {state === 'register' ? (
            <>
              Already have an account?{' '}
              <span
                onClick={() => setState('login')}
                className="text-primary font-medium cursor-pointer"
              >
                Click here
              </span>
            </>
          ) : (
            <>
              Create an account?{' '}
              <span
                onClick={() => setState('register')}
                className="text-secondary font-medium cursor-pointer"
              >
                Click here
              </span>
            </>
          )}
        </p>

        <button className="bg-primary hover:bg-primary-hover text-white w-full py-2 rounded-md transition">
          {state === 'register' ? 'Create Account' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default UserLogin;
