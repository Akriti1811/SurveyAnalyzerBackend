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

                res.status(200).json({message: 'File uploaded and converted to JSON'});
            } catch (csvError) {
                console.error('Error converting file to JSON:', csvError);
                res.status(500).json({message: 'Error converting file to JSON'});
            }
        }
    }catch(error){
        console.log(error);
    }
}