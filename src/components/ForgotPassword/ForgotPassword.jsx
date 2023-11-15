import React from "react";
import {
    Card,
    CardBody,
    CardTitle,
    CardText,
    Form,
    Label,
    Input,
    Button,
  } from "reactstrap";
import Logo from "../../assets/icons/Logo.svg";

function ForgotPassword() {
  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <Card className="mb-0 shadow">
          <CardBody>
            {/* <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}> */}
            <div className="d-flex text-center justify-content-center align-items-center">
              <img src={Logo} style={{ width: "200px" }} />
            </div>
            {/* </Link> */}
            <CardTitle tag="h4" className="mb-1">
              Forgot Password? 🔒
            </CardTitle>
            <CardText className="mb-2">
              Enter your Mobile number we'll send you an OTP to Reset Password
            </CardText>
            <Form
              className="auth-login-form mt-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="mb-1">
                <Label className="form-label" for="forgotpassword-number">
                  Mobile Number
                </Label>
                <Input
                  type="mobile"
                  id="login-email"
                  placeholder="+91 xxxxxxxx "
                  autoFocus
                />
              </div>
              <Button color="primary" block className="mb-4 mt-4">
                Send OTP
              </Button>
            </Form>
            <p className="text-center mt-2">
              {/* <Link to='/pages/register-basic'> */}
              <span>Back To Login</span>
              {/* </Link> */}
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default ForgotPassword;
