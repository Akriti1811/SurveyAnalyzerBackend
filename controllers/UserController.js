const User = require('../models/User');
const csvtojson = require('csvtojson');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const UserData = require('../models/UserData');

exports.upload = async (req, res) => {
    try{
        if (!req.file) {
            res.status(400).json({message: 'No file uploaded'});
        } else {
            let converter
            if(path.extname(req.file.path) == ".csv")
                converter = csvtojson().fromFile(req.file.path)
            else if(path.extname(req.file.path) == ".xlsx"){
                const workbook = xlsx.readFile(req.file.path);
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(sheet);
                converter = Promise.resolve(json);
            }
            else{
                res.status(403).json({message: "Only CSV and Excel files are allowed"})
            }
            
            try {
                const jsonArrayObj = await converter;
                const email = req.email;
                
                const gender = {
                    males: 0,
                    females: 0.
                }
                const overallSatisfaction = {
                    oneStar: 0,
                    twoStar: 0,
                    threeStar: 0,
                    fourStar: 0,
                    fiveStar: 0,
                };
                const jobSatisfaction = {
                    oneStar: 0,
                    twoStar: 0,
                    threeStar: 0,
                    fourStar: 0,
                    fiveStar: 0,
                };
                const organizationalCulture = {
                    oneStar: 0,
                    twoStar: 0,
                    threeStar: 0,
                    fourStar: 0,
                    fiveStar: 0,
                };
                const workLifeBalance = {
                    oneStar: 0,
                    twoStar: 0,
                    threeStar: 0,
                    fourStar: 0,
                    fiveStar: 0,
                };
                const department = {
                    finance: 0,
                    tech: 0,
                    sales: 0,
                    hr: 0,
                    content: 0,
                    product: 0,
                };

                jsonArrayObj.forEach((obj) => {
                    if(obj.Gender === 'male'){
                        gender.males += 1;
                    }
                    else{
                        gender.females += 1;
                    }

                    //overallSatisfaction
                    if(obj.OverallSatisfaction === '1'){
                        overallSatisfaction.oneStar += 1;
                    }
                    else if(obj.OverallSatisfaction === '2'){
                        overallSatisfaction.twoStar += 1;
                    }
                    else if(obj.OverallSatisfaction === '3'){
                        overallSatisfaction.threeStar += 1;
                    }
                    else if(obj.OverallSatisfaction === '4'){
                        overallSatisfaction.fourStar += 1;
                    }
                    else if(obj.OverallSatisfaction === '5'){
                        overallSatisfaction.fiveStar += 1;
                    }

                    //jobSatisfaction
                    if(obj.JobSatisfaction === '1'){
                        jobSatisfaction.oneStar += 1;
                    }
                    else if(obj.JobSatisfaction === '2'){
                        jobSatisfaction.twoStar += 1;
                    }
                    else if(obj.JobSatisfaction === '3'){
                        jobSatisfaction.threeStar += 1;
                    }
                    else if(obj.JobSatisfaction === '4'){
                        jobSatisfaction.fourStar += 1;
                    }
                    else if(obj.JobSatisfaction === '5'){
                        jobSatisfaction.fiveStar += 1;
                    }

                    //organizationalCulture
                    if(obj.OrganizationalCulture === '1'){
                        organizationalCulture.oneStar += 1;
                    }
                    else if(obj.OrganizationalCulture === '2'){
                        organizationalCulture.twoStar += 1;
                    }
                    else if(obj.OrganizationalCulture === '3'){
                        organizationalCulture.threeStar += 1;
                    }
                    else if(obj.OrganizationalCulture === '4'){
                        organizationalCulture.fourStar += 1;
                    }
                    else if(obj.OrganizationalCulture === '5'){
                        organizationalCulture.fiveStar += 1;
                    }

                    //workLifeBalance
                    if(obj.WorkLifeBalance === '1'){
                        workLifeBalance.oneStar += 1;
                    }
                    else if(obj.WorkLifeBalance === '2'){
                        workLifeBalance.twoStar += 1;
                    }
                    else if(obj.WorkLifeBalance === '3'){
                        workLifeBalance.threeStar += 1;
                    }
                    else if(obj.WorkLifeBalance === '4'){
                        workLifeBalance.fourStar += 1;
                    }
                    else if(obj.WorkLifeBalance === '5'){
                        workLifeBalance.fiveStar += 1;
                    }

                    //department
                    if(obj.Department === 'finance'){
                        department.finance += 1;
                    }
                    else if(obj.Department === 'tech'){
                        department.tech += 1;
                    }
                    else if(obj.Department === 'sales'){
                        department.sales += 1;
                    }
                    else if(obj.Department === 'hr'){
                        department.hr += 1;
                    }
                    else if(obj.Department === 'content'){
                        department.content += 1;
                    }
                    else if(obj.Department === 'product'){
                        department.product += 1;
                    }
                });
                
                const userData = await UserData.findOne({email});

                if (!userData) {
                    await UserData.create({
                        email,
                        data: {
                            fileName: req.file.originalname,
                            fileContent: JSON.stringify(jsonArrayObj)
                        }
                    });
                } else {
                    const { data } = userData;
                    
                    data.push({
                        fileName: req.file.originalname,
                        fileContent: JSON.stringify(jsonArrayObj)
                    });

                    await userData.save();
                }

                res.status(200).json({gender, department, overallSatisfaction, jobSatisfaction, organizationalCulture, workLifeBalance, message: 'File uploaded Successfully!'});
            } catch (csvError) {
                console.error('Error uploading', csvError);
                res.status(500).json({message: 'Error uploading'});
            }
        }
    }catch(error){
        console.log(error);
    }
}