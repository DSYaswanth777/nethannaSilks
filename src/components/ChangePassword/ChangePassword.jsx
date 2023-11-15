import React from "react";
import { CardBody, CardTitle, Form, Label, Button } from "reactstrap";
import Logo from "../../assets/icons/Logo.svg";
import InputPasswordToggle from "../Input-password/Index";
import { CgPassword } from "react-icons/cg";

function ChangePassword() {
  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <div className="mb-0">
          <CardBody>
            <div className="d-flex text-center justify-content-center align-items-center">
              <img src={Logo} style={{ width: "200px" }} />
            </div>

            <CardTitle tag="h4" className="mb-1 mt-5">
              Change Password <CgPassword />
            </CardTitle>
            <Form
              className="auth-login-form mt-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="mb-1">
                <div className="d-flex justify-content-between mt-3">
                  <Label className="form-label" for="login-password">
                    Current Password
                  </Label>
                </div>
                <InputPasswordToggle
                  className="input-group-merge"
                  id="login-password"
                />
              </div>
              <div className="mb-1">
                <div className="d-flex justify-content-between mt-3">
                  <Label className="form-label" for="login-password">
                    New Password
                  </Label>
                </div>
                <InputPasswordToggle
                  className="input-group-merge"
                  id="login-password"
                />
              </div>
              <Button color="primary" block className="mb-4 mt-4">
                Change Password{" "}
              </Button>
            </Form>
          </CardBody>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
