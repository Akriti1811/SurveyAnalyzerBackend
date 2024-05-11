const User = require("../models/User");
const csvtojson = require("csvtojson");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const UserData = require("../models/UserData");
const CompanyData = require("../models/CompanyData");
const { analyzeData, analyzeCompanyData } = require("../functions/analyzeData");

exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
    } else {
      let converter;
      if (path.extname(req.file.path) == ".csv")
        converter = csvtojson().fromFile(req.file.path);
      else if (path.extname(req.file.path) == ".xlsx") {
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(sheet);
        converter = Promise.resolve(json);
      } else {
        res
          .status(403)
          .json({ message: "Only CSV and Excel files are allowed" });
      }

      try {
        const jsonArrayObj = await converter;
        const email = req.email;

        const data = analyzeData(jsonArrayObj);

        const userData = await UserData.findOne({ email });
        let fileId = "";

        if (!userData) {
          const newUserData = await UserData.create({
            email,
            data: {
              fileName: req.file.originalname,
              fileContent: JSON.stringify(jsonArrayObj),
            },
          });
          fileId = newUserData.data[0]._id;
        } else {
          const { data } = userData;

          data.push({
            fileName: req.file.originalname,
            fileContent: JSON.stringify(jsonArrayObj),
          });

          await userData.save();

          const newUserData = await UserData.findOne({ email });
          const lastItem = newUserData.data[newUserData.data.length - 1];
          console.log(lastItem.fileName);
          fileId = lastItem._id;
        }

        return res
          .status(200)
          .json({ ...data, fileId, message: "File uploaded Successfully!" });
      } catch (csvError) {
        console.error("Error uploading", csvError);
        return res.status(500).json({ message: "Error uploading" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getUploads = async (req, res) => {
  try {
    const email = req.email;
    const userData = await UserData.find({ email });

    console.log(userData);

    if (!userData) {
      res.status(404).json({ message: "No data found" });
    } else {
      res
        .status(200)
        .json({ userData, message: "Uploads Fetched successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getTenureData = async (req, res) => {
  try {
    const { fileId, minTenure, maxTenure } = req.query;
    const email = req.email;
    const userData = await UserData.findOne({ email });
    const fileData = userData.data.find((file) => file._id.equals(fileId));

    const data = analyzeData(JSON.parse(fileData.fileContent), {
      analysis: "tenure",
      minTenure,
      maxTenure,
    });

    return res
      .status(200)
      .json({ ...data, fileId, message: "Data Analyzed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to analyze data" });
  }
};

exports.getComparisonData = async (req, res) => {
  try {
    const { fileId, criteria, criteria1, criteria2 } = req.query;
    const email = req.email;
    const userData = await UserData.findOne({ email });
    const fileData = userData.data.find((file) => file._id.equals(fileId));

    const data1 = analyzeData(JSON.parse(fileData.fileContent), {
      analysis: criteria,
      criteria: criteria1,
    });

    const data2 = analyzeData(JSON.parse(fileData.fileContent), {
      analysis: criteria,
      criteria: criteria2,
    });

    const overallSatisfaction1 = [
      { name: "1 star", count: data1.overallSatisfaction.oneStar },
      { name: "2 star", count: data1.overallSatisfaction.twoStar },
      { name: "3 star", count: data1.overallSatisfaction.threeStar },
      { name: "4 star", count: data1.overallSatisfaction.fourStar },
      { name: "5 star", count: data1.overallSatisfaction.fiveStar },
    ];

    const overallSatisfaction2 = [
      { name: "1 star", count: data2.overallSatisfaction.oneStar },
      { name: "2 star", count: data2.overallSatisfaction.twoStar },
      { name: "3 star", count: data2.overallSatisfaction.threeStar },
      { name: "4 star", count: data2.overallSatisfaction.fourStar },
      { name: "5 star", count: data2.overallSatisfaction.fiveStar },
    ];

    const jobSatisfaction1 = [
      { name: "1 star", count: data1.jobSatisfaction.oneStar },
      { name: "2 star", count: data1.jobSatisfaction.twoStar },
      { name: "3 star", count: data1.jobSatisfaction.threeStar },
      { name: "4 star", count: data1.jobSatisfaction.fourStar },
      { name: "5 star", count: data1.jobSatisfaction.fiveStar },
    ];

    const jobSatisfaction2 = [
      { name: "1 star", count: data2.jobSatisfaction.oneStar },
      { name: "2 star", count: data2.jobSatisfaction.twoStar },
      { name: "3 star", count: data2.jobSatisfaction.threeStar },
      { name: "4 star", count: data2.jobSatisfaction.fourStar },
      { name: "5 star", count: data2.jobSatisfaction.fiveStar },
    ];

    const organizationalCulture1 = [
      { name: "1 star", count: data1.organizationalCulture.oneStar },
      { name: "2 star", count: data1.organizationalCulture.twoStar },
      { name: "3 star", count: data1.organizationalCulture.threeStar },
      { name: "4 star", count: data1.organizationalCulture.fourStar },
      { name: "5 star", count: data1.organizationalCulture.fiveStar },
    ];

    const organizationalCulture2 = [
      { name: "1 star", count: data2.organizationalCulture.oneStar },
      { name: "2 star", count: data2.organizationalCulture.twoStar },
      { name: "3 star", count: data2.organizationalCulture.threeStar },
      { name: "4 star", count: data2.organizationalCulture.fourStar },
      { name: "5 star", count: data2.organizationalCulture.fiveStar },
    ];

    const workLifeBalance1 = [
      { name: "1 star", count: data1.workLifeBalance.oneStar },
      { name: "2 star", count: data1.workLifeBalance.twoStar },
      { name: "3 star", count: data1.workLifeBalance.threeStar },
      { name: "4 star", count: data1.workLifeBalance.fourStar },
      { name: "5 star", count: data1.workLifeBalance.fiveStar },
    ];

    const workLifeBalance2 = [
      { name: "1 star", count: data2.workLifeBalance.oneStar },
      { name: "2 star", count: data2.workLifeBalance.twoStar },
      { name: "3 star", count: data2.workLifeBalance.threeStar },
      { name: "4 star", count: data2.workLifeBalance.fourStar },
      { name: "5 star", count: data2.workLifeBalance.fiveStar },
    ];

    const data = {
      analysisData1: {
        overallSatisfaction: overallSatisfaction1,
        jobSatisfaction: jobSatisfaction1,
        organizationalCulture: organizationalCulture1,
        workLifeBalance: workLifeBalance1,
      },
      analysisData2: {
        overallSatisfaction: overallSatisfaction2,
        jobSatisfaction: jobSatisfaction2,
        organizationalCulture: organizationalCulture2,
        workLifeBalance: workLifeBalance2,
      },
    };

    return res
      .status(200)
      .json({ ...data, fileId, message: "Data Compared successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to compare data" });
  }
};

exports.getCompanyData = async (req, res) => {
  try {
    const { fileId, companyName } = req.query;
    const email = req.email;
    const userData = await UserData.findOne({ email });
    const fileData = userData.data.find((file) => file._id.equals(fileId));

    const companyData = await CompanyData.findOne({ companyName: companyName });

    const data1 = analyzeData(JSON.parse(fileData.fileContent));

    const data2 = analyzeCompanyData(companyData.data);

    const overallSatisfaction1 = [
      { name: "1 star", count: data1.overallSatisfaction.oneStar },
      { name: "2 star", count: data1.overallSatisfaction.twoStar },
      { name: "3 star", count: data1.overallSatisfaction.threeStar },
      { name: "4 star", count: data1.overallSatisfaction.fourStar },
      { name: "5 star", count: data1.overallSatisfaction.fiveStar },
    ];

    const overallSatisfaction2 = [
      { name: "1 star", count: data2.overallSatisfaction.oneStar },
      { name: "2 star", count: data2.overallSatisfaction.twoStar },
      { name: "3 star", count: data2.overallSatisfaction.threeStar },
      { name: "4 star", count: data2.overallSatisfaction.fourStar },
      { name: "5 star", count: data2.overallSatisfaction.fiveStar },
    ];

    const jobSatisfaction1 = [
      { name: "1 star", count: data1.jobSatisfaction.oneStar },
      { name: "2 star", count: data1.jobSatisfaction.twoStar },
      { name: "3 star", count: data1.jobSatisfaction.threeStar },
      { name: "4 star", count: data1.jobSatisfaction.fourStar },
      { name: "5 star", count: data1.jobSatisfaction.fiveStar },
    ];

    const jobSatisfaction2 = [
      { name: "1 star", count: data2.jobSatisfaction.oneStar },
      { name: "2 star", count: data2.jobSatisfaction.twoStar },
      { name: "3 star", count: data2.jobSatisfaction.threeStar },
      { name: "4 star", count: data2.jobSatisfaction.fourStar },
      { name: "5 star", count: data2.jobSatisfaction.fiveStar },
    ];

    const organizationalCulture1 = [
      { name: "1 star", count: data1.organizationalCulture.oneStar },
      { name: "2 star", count: data1.organizationalCulture.twoStar },
      { name: "3 star", count: data1.organizationalCulture.threeStar },
      { name: "4 star", count: data1.organizationalCulture.fourStar },
      { name: "5 star", count: data1.organizationalCulture.fiveStar },
    ];

    const organizationalCulture2 = [
      { name: "1 star", count: data2.organizationalCulture.oneStar },
      { name: "2 star", count: data2.organizationalCulture.twoStar },
      { name: "3 star", count: data2.organizationalCulture.threeStar },
      { name: "4 star", count: data2.organizationalCulture.fourStar },
      { name: "5 star", count: data2.organizationalCulture.fiveStar },
    ];

    const workLifeBalance1 = [
      { name: "1 star", count: data1.workLifeBalance.oneStar },
      { name: "2 star", count: data1.workLifeBalance.twoStar },
      { name: "3 star", count: data1.workLifeBalance.threeStar },
      { name: "4 star", count: data1.workLifeBalance.fourStar },
      { name: "5 star", count: data1.workLifeBalance.fiveStar },
    ];

    const workLifeBalance2 = [
      { name: "1 star", count: data2.workLifeBalance.oneStar },
      { name: "2 star", count: data2.workLifeBalance.twoStar },
      { name: "3 star", count: data2.workLifeBalance.threeStar },
      { name: "4 star", count: data2.workLifeBalance.fourStar },
      { name: "5 star", count: data2.workLifeBalance.fiveStar },
    ];

    const data = {
      analysisData1: {
        overallSatisfaction: overallSatisfaction1,
        jobSatisfaction: jobSatisfaction1,
        organizationalCulture: organizationalCulture1,
        workLifeBalance: workLifeBalance1,
        average: {
          overallSatisfaction: data1.overallSatisfaction.average,
          jobSatisfaction: data1.jobSatisfaction.average,
          organizationalCulture: data1.organizationalCulture.average,
          workLifeBalance: data1.workLifeBalance.average,
        },
      },
      analysisData2: {
        overallSatisfaction: overallSatisfaction2,
        jobSatisfaction: jobSatisfaction2,
        organizationalCulture: organizationalCulture2,
        workLifeBalance: workLifeBalance2,
        average: {
          overallSatisfaction: data2.overallSatisfaction.average,
          jobSatisfaction: data2.jobSatisfaction.average,
          organizationalCulture: data2.organizationalCulture.average,
          workLifeBalance: data2.workLifeBalance.average,
        },
      },
    };

    return res
      .status(200)
      .json({ ...data, fileId, message: "Data Compared successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to compare data" });
  }
};
