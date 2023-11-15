import { useForm, Controller } from "react-hook-form";
import { Button, CardTitle, Form, Input, Label } from "reactstrap";
import Logo from "../../assets/icons/Logo.svg";
import { signupValidationSchema } from "../../schema/validationSchema";
import InputPasswordToggle from "../Input-password/Index";
import { useDispatch, useSelector } from "react-redux";
import { signupAsync, verifyOtpAsync } from "../../redux/slice/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/icons/login.json";
const Signup = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const user = useSelector((state) => state?.auth?.user);
  const isLoading = useSelector((state) => state?.auth?.isLoading);
  const onSubmit = (data) => {
    const { name, email, password, confirmPassword, mobile } = data;
    dispatch(signupAsync({ name, email, password, confirmPassword, mobile }))
      .then(() => {
        setSignupSuccess(true);
        setMobile(mobile);
      })
      .catch((error) => {
        toast.error("Signup failed:", error);
      });
  };
  useEffect(() => {
    // Check if the user is already signed up but not verified
    if (user && !user.isVerified) {
      setSignupSuccess(true);
      setMobile(user.mobile); // Set the mobile number for OTP verification
    }
  }, [user]);
  const handleOtpSubmit = () => {
    const mobileNumber = parseInt(mobile);
    const otpNumber = parseInt(otp, 10);
    dispatch(verifyOtpAsync({ mobile: mobileNumber, otp: otpNumber }))
      .then((success) => {
        if (success) {
          navigate("/login");
        } else {
          console.error("OTP verification failed");
        }
      })
      .catch((error) => {
        console.error("OTP verification error:", error);
      });
  };
  return (
    <div className="auth-wrapper auth-basic  w-100">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Lottie animationData={loginAnimation} />
        </div>
      ) : (
        <div className="signup-content shadow-sm border p-4 m-3">
          {signupSuccess ? (
            <div>
              <h4 className="mb-2 mt-3">Mobile Verification</h4>
              <p>We've sent an OTP to your mobile number: {mobile}</p>
              <div className="mb-1">
                <Label className="form-label" htmlFor="otp-input">
                  Enter Mobile number
                </Label>
                <Input
                  type="number"
                  id="mobile-input"
                  placeholder="Your mobile number"
                  value={mobile}
                  disabled
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" htmlFor="otp-input">
                  Enter OTP
                </Label>
                <Input
                  type="number"
                  id="otp-input"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <Button
                color="success"
                block
                className="verifyOtpBtn mt-2"
                onClick={handleOtpSubmit}
              >
                Verify OTP
              </Button>
            </div>
          ) : (
            <div className="">
              <div>
                <div className="d-flex text-center justify-content-center align-items-center">
                  <img src={Logo} alt="Logo" />
                </div>
                <CardTitle tag="h4" className="mb-2 mt-3 text-center fw-medium">
                  Create an Account!
                </CardTitle>
                <Form
                  className="auth-login-form mt-2"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="mb-1">
                    <Label className="form-label" for="signup-name">
                      Name
                    </Label>
                    <Controller
                      name="name"
                      control={control}
                      defaultValue=""
                      rules={signupValidationSchema.name}
                      render={({ field }) => (
                        <Input
                          type="text"
                          id="signup-name"
                          placeholder="Your beautiful name"
                          autoFocus
                          {...field}
                        />
                      )}
                    />
                    {errors.name && (
                      <span className="text-danger">
                        Name is required and should have at least 4 characters.
                      </span>
                    )}
                  </div>
                  <div className="mb-1">
                    <Label className="form-label" for="login-email">
                      Email
                    </Label>
                    <Controller
                      name="email"
                      control={control}
                      defaultValue=""
                      rules={signupValidationSchema.email}
                      render={({ field }) => (
                        <Input
                          type="email"
                          id="siginup-email"
                          placeholder="john@gmail.com"
                          autoFocus
                          {...field}
                        />
                      )}
                    />
                    {errors.email && (
                      <span className="text-danger">
                        Invalid email address.
                      </span>
                    )}
                  </div>
                  <div className="mb-1">
                    <Label className="form-label" for="login-email">
                      Mobile
                    </Label>
                    <Controller
                      name="mobile"
                      control={control}
                      defaultValue=""
                      rules={signupValidationSchema.mobile}
                      render={({ field }) => (
                        <Input
                          type="mobile"
                          id="signup-mobile"
                          placeholder="9XXXXXXX"
                          autoFocus
                          {...field}
                        />
                      )}
                    />
                    {errors.mobile && (
                      <span className="text-danger">
                        Invalid Mobile Number.
                      </span>
                    )}
                  </div>
                  <div className="mb-1">
                    <div className="d-flex justify-content-between mt-3">
                      <Label className="form-label" for="login-password">
                        Password
                      </Label>
                    </div>
                    <Controller
                      name="password"
                      control={control}
                      defaultValue=""
                      rules={signupValidationSchema.password}
                      render={({ field }) => (
                        <InputPasswordToggle
                          className="input-group-merge"
                          id="login-password"
                          {...field}
                        />
                      )}
                    />
                    {errors.password && (
                      <span className="text-danger">
                        Password is required, should be between 6 and 10
                        characters, and must contain at least one digit.
                      </span>
                    )}
                  </div>
                  <div className="mb-1">
                    <div className="d-flex justify-content-between mt-3">
                      <Label className="form-label" for="login-password">
                        Confirm Password
                      </Label>
                    </div>
                    <Controller
                      name="confirmPassword"
                      control={control}
                      defaultValue=""
                      rules={signupValidationSchema.confirmPassword}
                      render={({ field }) => (
                        <InputPasswordToggle
                          className="input-group-merge mb-4"
                          id="confirm-password"
                          {...field}
                        />
                      )}
                    />
                    {errors.confirmPassword && (
                      <span className="text-danger">
                        Passwords do not match.
                      </span>
                    )}
                  </div>
                  <Button
                    color="success"
                    block
                    className="signUpBtn"
                    type="submit"
                  >
                    Sign Up
                  </Button>
                </Form>
                <div className="text-center mt-2">
                  <span className="me-2">Already have an account ?</span>{" "}
                  <p
                    className="text-decoration-underline"
                    onClick={() => navigate("/login")}
                  >
                    Signin Instead
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Signup;
