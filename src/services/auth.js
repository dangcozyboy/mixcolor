import React from "react";

import * as XLSX from "xlsx/xlsx.mjs";
const auth = () => {
  return new Promise((resolve, reject) => {
    let arrayAuth = [];
    const fileUrl = "./auth.xlsx";
    fetch(fileUrl)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        jsonData.shift();
        jsonData.forEach((row) => {
          arrayAuth.push(btoa(`${row[2]}+${row[3]}`));
        });
        resolve(arrayAuth);
      })
      .catch((error) => {
        console.error("Error importing Excel file:", error);
        reject(error);
      });
  });
};
export default auth;
