// server.js

const express = require('express');
const multer = require('multer');
const csvtojson = require('csvtojson');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = express();
const port = 3000;

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/'); 
    }
    ,
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Check if uploaded file is a CSV
        if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            cb(null, true);
        } else {
            cb(new Error('Only CSV and Excel files are allowed'));
        }
    }
}).single('avatar');

// Upload endpoint
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(400).send(err.message);
        } else {
            if (!req.file) {
                res.status(400).send('Error: No file uploaded');
            } else {
                // Convert CSV to JSON
                // console.log(req.file.mimetype)
                // console.log(req.file.originalname)
                // console.log(req.file.destination)
                // console.log(req.file.path)
                // console.log(path.extname(req.file.path))
                // console.log(path.parse(req.file.filename).name)
                // console.log(path.basename(req.file.filename))
                

                let converter
                if(path.extname(req.file.path) == ".csv")
                    converter = csvtojson().fromFile(req.file.path)
                else{ 
                    if(path.extname(req.file.path) == ".xlsx"){
                        const workbook = xlsx.readFile(req.file.path);
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        const json = xlsx.utils.sheet_to_json(sheet);
                        converter = Promise.resolve(json);
                    }
                    else{
                        // This is temp, needs to be changed
                        res.send("Only CSV and Excel files are allowed")
                    }
                }
                
                converter.then((jsonArrayObj) => {
                    const jsonFilePath = `./uploads/${path.parse(req.file.filename).name}.json`;

                    // Write JSON to a file
                    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArrayObj, null, 2));

                    // Delete original uploaded file
                    fs.unlinkSync(req.file.path);

                    res.send('File uploaded and converted to JSON, and original file deleted');
                })
                .catch((csvError) => {
                    console.error('Error converting file to JSON:', csvError);
                    res.status(500).send('Error converting file to JSON');
                });
            }
        }
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.listen(port, () => console.log(`Server running on port ${port}`));
