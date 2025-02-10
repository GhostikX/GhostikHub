import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { performRegistration } from '../services/user-client';
import EmailConfirmationModal from '../components/user/EmailConfirmationModal';
import LoadingDots from '../components/user/LoadingDots';

const SignUp = ({ userData }) => {
  const [registrationForm, setRegistrationForm] = useState({ 
    username: '',
    email: '',
    password: '',
    ip_address: '', 
    location: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userData.ip_address && userData.location) {
      setRegistrationForm((prevForm) => ({
        ...prevForm,
        ip_address: userData.ip_address,
        location: userData.location
      }));
    }
  }, [userData]); 

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateForSpaces = (inputField) => {
    const hasSpaces = /\s/;
    return hasSpaces.test(inputField)
  }

  const validateData = () => {
    const errors = {};

    if (registrationForm.email.length === 0 || registrationForm.password.length === 0 || registrationForm.username.length === 0 || confirmPassword.length === 0) errors.global = "The registration form must be filled out completely";
    else if (registrationForm.username.length <= 2) errors.username = 'Username must be greater than 2 characters'
    else if (validateForSpaces(registrationForm.username)) errors.username = 'Username should not contain any spaces' 
    else if (!validateEmail(registrationForm.email)) errors.email = 'Email must be in correct form'
    else if (registrationForm.password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (validateForSpaces(registrationForm.password)) errors.password = 'Password should not contain any spaces' 
    else if (registrationForm.password !== confirmPassword) errors.confirmPassword = 'Confirm Password must be the same';
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateData()) return;
    setIsLoading(true);
    performRegistration(registrationForm).then(res => {
      setIsModalOpen(true);
    }).catch(err => {
      if (err.status === 409)
        setErrors({ global: err.response.data.message })
      else
        setErrors({ global: 'Registration failed. Please try again' })
    }).finally(() => {
      setIsLoading(false);
    })
  };


  const handleClose = () => {
      setIsModalOpen(false);
      navigate("/login")
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isModalOpen && <EmailConfirmationModal email={registrationForm.email} onClose={handleClose} />}
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md bg-settings text-white">
        <h2 className="mb-6 text-2xl font-semibold text-center">Sign Up</h2>
        {errors.global && <div className="mb-4 text-red-500">{errors.global}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-lg text-white">Username</label>
            <input
              type="text"
              id="username"
              maxLength={60}
              value={registrationForm.username}
              onChange={(e) => setRegistrationForm({...registrationForm, username: e.target.value})}
              className={`
                w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500
                ${errors.username ? 'border-red-600 border-opacity-40' : ''}
                `}
            />
            {errors.username && <p className='text-red-600 text-opacity-70 p-1'>{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-lg text-white">Email</label>
            <input
              type="text"
              id="email"
              value={registrationForm.email}
              onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
              className={`
                w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500
                ${errors.email ? 'border-red-600 border-opacity-40' : ''}
                `}
            />
            {errors.email && <p className='text-red-600 text-opacity-70 p-1'>{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-lg text-white">Password</label>
            <input
              type="password"
              id="password"
              value={registrationForm.password}
              onChange={(e) => setRegistrationForm({...registrationForm, password: e.target.value})}
              className={`
                w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500
                ${errors.password ? 'border-red-600 border-opacity-40' : ''}
                `}
            />
            {errors.password && <p className='text-red-600 text-opacity-70 p-1'>{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-lg text-white">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`
                w-full px-3 py-2 pr-12 rounded-lg bg-gray-800 bg-opacity-30 text-gray-200 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 transition duration-500
                ${errors.confirmPassword ? 'border-red-600 border-opacity-40' : ''}
                `}
            />
            {errors.confirmPassword && <p className='text-red-600 text-opacity-70 p-1'>{errors.confirmPassword}</p>}
          </div>
          {isLoading ? (
            <LoadingDots />
          ) : (
            <button type="submit" className="w-full text-lg px-4 py-2 bg-gray-700 bg-opacity-40 text-gray-200 rounded-md transition duration-500 hover:bg-gray-600 focus:outline-none">
              Sign Up
            </button> 
          )}
        </form>
      </div>
    </div>
  );
};
export default SignUp;