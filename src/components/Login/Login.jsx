import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "../../redux/slice/authSlice";
import Logo from "../../assets/icons/Logo.svg";
import InputPasswordToggle from "../Input-password/Index";
import { CardBody, CardText, Form, Label, Input, Button } from "reactstrap";
import "./Login.scss";

import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { validationSchema } from "../../schema/validationSchema";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/icons/login.json";
const Login = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const user = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onBlur", // Validate on blur
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user.isAuthenticated === true) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (data) => {
    const { email, password } = data;
    dispatch(loginAsync({ username: email, password }));
  };

  return (
    <div className="bg-light login-container">
      <div className=" h-100 container d-flex justify-content-center align-items-center  login-box  ">
        <div className="auth-inner mh-100  border shadow-sm p-4 rounded-3 ">
          {isLoading ? (
            <Lottie animationData={loginAnimation} />
          ) : (
            <div className=" ">
              <CardBody className="">
                <div className="d-flex text-center justify-content-center align-items-center mb-4">
                  <img src={Logo} style={{ width: "200px" }} alt="Logo" />
                </div>
                <CardText className="mb-4 fs-6 fw-medium">
                  Please sign-in to your account and start shopping.
                </CardText>
                <Form
                  className="auth-login-form mt-2"
                  onSubmit={handleSubmit(handleLogin)}
                >
                  <div className="mb-1">
                    <Label
                      className="form-label fw-medium"
                      htmlFor="login-email"
                    >
                      Email/Mobile Number
                    </Label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Input
                            type="emailMobile"
                            id="login-email"
                            placeholder="john@gmail.com"
                            autoFocus
                            {...field}
                          />
                          {errors.emailMobile && (
                            <span className="error-text text-danger">
                              {errors.emailMobile.message}
                            </span>
                          )}
                        </>
                      )}
                      rules={validationSchema.email}
                    />
                  </div>
                  <div className="mb-1">
                    <div className="d-flex justify-content-between mt-3">
                      <Label
                        className="form-label fw-medium"
                        htmlFor="login-password"
                      >
                        Password
                      </Label>
                      <small>
                        <p
                          onClick={() => navigate("/forgotpassword")}
                          className="text-decoration-underline fw-bold"
                        >
                          Forgot Password?
                        </p>
                      </small>
                    </div>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <>
                          <InputPasswordToggle
                            className="input-group-merge mb-5"
                            id="login-password"
                            {...field}
                          />
                          {errors.password && (
                            <span className="error-text text-danger">
                              {errors.password.message}
                            </span>
                          )}
                        </>
                      )}
                      rules={validationSchema.password}
                    />
                  </div>
                  <Button
                    className="signinBtn"
                    block
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </Form>
                <div className="text-center mt-4">
                  <span className="me-2">New Customer?</span>

                  <p
                    className="text-decoration-underline "
                    onClick={() => navigate("/signup")}
                  >
                    Create an account
                  </p>
                </div>
              </CardBody>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
