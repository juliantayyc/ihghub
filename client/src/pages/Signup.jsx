import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

function Signup() {
  const [serverError, setServerError] = useState('');

  const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required('Username is required'),
    password: Yup.string().min(4).max(20).required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const onSubmit = (data, { setSubmitting, resetForm }) => {
    axios
      .post('http://localhost:3001/auth', data)
      .then((response) => {
        if (response.data.error) {
          setServerError(response.data.error);
        } else {
          console.log(response.data);
          setServerError('');
          resetForm();
          // Optionally, redirect the user or show a success message
        }
      })
      .catch((error) => {
        setServerError('An unexpected error occurred.');
        console.error(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-n-8">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting }) => (
          <Form className="bg-orange-100 p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
              Create New Account
            </h2>
            {serverError && (
              <div className="text-red-500 text-center mb-4">{serverError}</div>
            )}

            <div className="mb-6">
              <label
                className="block text-gray-600 mb-1"
                htmlFor="username"
              >
                Username:
              </label>
              <Field
                autoComplete="off"
                id="username"
                name="username"
                placeholder="(Ex. John123...)"
                className="w-full px-4 py-2 bg-orange-200 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-600 mb-1"
                htmlFor="password"
              >
                Password:
              </label>
              <Field
                autoComplete="off"
                type="password"
                id="password"
                name="password"
                placeholder="Your Password..."
                className="w-full px-4 py-2 bg-orange-200 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-600 mb-1"
                htmlFor="confirmPassword"
              >
                Confirm Password:
              </label>
              <Field
                autoComplete="off"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-4 py-2 bg-orange-200 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm Your Password..."
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-400 text-black font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Sign Up
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;
