import React, { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/auth";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const LoginForm = () => {
  const history = useHistory();
  const { checkLogin, login } = useAuth();
  useEffect(() => {
    checkLogin().then((res) => {
      if (res) {
        history.push("/");
      }
    });
  }, []);
  const onFinish = (value) => {
    const token = btoa(`${value.username}+${value.password}`);
    login(token);
  };
  return (
    <div className="layout">
      <div className="container">
        <div className="containerHeader"></div>
        <div className="headerLogin">Change Academy</div>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600, marginTop: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#be3455" }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default LoginForm;
