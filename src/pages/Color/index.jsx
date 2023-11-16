import { Form, Button, Select } from "antd";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx/xlsx.mjs";
import "./style.css";
import { ReloadOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/auth";
import { useHistory } from "react-router-dom";
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const filterLabelRoot = (input, optionIn, options) => {
  let optionOut = false;
  for (const option of options) {
    if (
      option.label.toLowerCase().includes(input.toLowerCase()) &&
      optionIn.value === option.value
    ) {
      // console.log(option, optionIn);
      optionOut = true;
      break;
    }
  }

  return optionOut;
};
const editOptionValue = (options) => {
  const editedOptions = [];
  options.forEach((option, key) => {
    const newOption = {
      key: key,
      value: option.value,
      label: (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {option.label}
            <div
              style={{ backgroundColor: option.value, width: 30, height: 30 }}
            ></div>
          </div>
        </>
      ),
    };
    editedOptions.push(newOption);
  });
  return editedOptions;
};
export const ColorScheme = () => {
  const [datas, setDatas] = useState([]);
  const [rootLips, setRootLips] = useState([]);
  const [afterLips, setAfterLips] = useState([]);
  const [result, setResult] = useState();
  const [rootLip, setRootLip] = useState();
  const [afterLip, setAfterLip] = useState();
  const [form] = Form.useForm();
  const formRef = React.useRef(null);
  const { checkLogin } = useAuth();
  const fileUrl = "./mau.xlsx";
  const history = useHistory();
  let hasFetch = false;
  const onRootSelect = (value, key) => {
    setRootLip(key.value);
    const afterLips2 = datas.find((obj) => obj.root.value === key.value);
    const afterLips3 = [];
    afterLips2.mix.forEach((lip) => {
      afterLips3.push(lip.after);
    });
    form.setFieldValue("after", null);
    setAfterLip();
    setResult();
    setAfterLips(afterLips3);
  };
  const onAfterSelect = (value, key) => {
    setAfterLip(value);
    const result2 = datas.find((obj) => obj.root.value === rootLip);
    const result3 = result2.mix.find((obj) => obj.after.value === key.value);
    setResult(result3.result);
  };
  const onSearch = (value, key) => {
    console.log("search:", value, key);
  };
  useEffect(() => {
    checkLogin().then((res) => {
      if (!res) {
        history.push("/login");
      }
    });
    if (!hasFetch) {
      hasFetch = true;
      fetch(fileUrl)
        .then((response) => response.arrayBuffer())
        .then((data) => {
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          jsonData.shift();
          const dataTemp = [];
          jsonData.forEach((row) => {
            if (row[8]) {
              const dataExist = dataTemp.find(
                (obj) => obj.root.value === row[2]
              );
              if (!dataExist) {
                dataTemp.push({
                  key: row[0],
                  root: {
                    value: row[2],
                    label: row[1],
                  },
                  mix: [
                    {
                      after: {
                        value: row[5],
                        label: row[4],
                      },
                      result: {
                        value: row[8],
                        label: row[7],
                      },
                    },
                  ],
                });
              } else {
                dataExist.mix.push({
                  after: {
                    value: row[5],
                    label: row[4],
                  },
                  result: {
                    value: row[8],
                    label: row[7],
                  },
                });
              }
            }
          });
          setDatas(dataTemp);
          const lips = [];
          dataTemp.forEach((data) => {
            lips.push(data.root);
          });
          setRootLips(lips);
        })
        .catch((error) => {
          console.error("Error importing Excel file:", error);
        });
    }
  }, []);
  function handleReset() {
    setRootLip();
    setAfterLip();
    setResult();
    form.resetFields();
  }

  return (
    <div className="layout">
      <div className="container">
        <div className="containerHeader"></div>
        <div className="header">Change Smart Color</div>
        <Form
          className="form"
          form={form}
          {...layout}
          ref={formRef}
          onReset={handleReset}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
              width: "100%",
            }}
          >
            <Form.Item>
              <Button
                style={{
                  backgroundColor: "green",
                  color: "white",
                }}
                type="default"
                htmlType="reset"
              >
                Refresh
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                style={{ backgroundColor: "red", color: "white" }}
                type="default"
                htmlType="button"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              >
                Log out
              </Button>
            </Form.Item>
          </div>
          <Form.Item
            name="root"
            label="Màu môi gốc"
            style={{ fontWeight: 700 }}
          >
            <Select
              showSearch
              placeholder="Chọn màu môi gốc"
              optionFilterProp="children"
              onChange={onRootSelect}
              onSearch={onSearch}
              filterOption={(input, option) => {
                return filterLabelRoot(input, option, rootLips);
              }}
              style={{ marginBottom: 10 }}
              disabled={result}
              options={editOptionValue(rootLips)}
            />
            <div
              className="sample"
              style={{
                backgroundColor: rootLip,
                display: rootLip ? "flex" : "none",
              }}
            ></div>
          </Form.Item>
          <Form.Item
            name="after"
            label="Màu môi sau bong"
            style={{ fontWeight: 700 }}
          >
            <Select
              showSearch
              disabled={result || !rootLip}
              placeholder="Chọn màu môi sau bong"
              optionFilterProp="children"
              onChange={onAfterSelect}
              onSearch={onSearch}
              filterOption={(input, option) => {
                return filterLabelRoot(input, option, afterLips);
              }}
              style={{ marginBottom: 10 }}
              options={editOptionValue(afterLips)}
            />
            <div
              className="sample"
              style={{
                backgroundColor: afterLip,
                display: afterLip ? "flex" : "none",
              }}
            ></div>
          </Form.Item>
        </Form>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            borderTop: "1px solid rgb(232 232 232)",
          }}
        >
          <Form
            style={{ width: "400px", padding: "0px 20px", marginTop: " 20px" }}
            {...layout}
          >
            <Form.Item
              label="Màu đi vào"
              style={{ marginBottom: 5, fontWeight: 700 }}
            >
              {result ? (
                <div
                  className="sampleresult"
                  style={{ backgroundColor: result.value }}
                >
                  {result.label}
                </div>
              ) : (
                <div className="result"></div>
              )}
            </Form.Item>
            <Form.Item {...tailLayout}></Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
