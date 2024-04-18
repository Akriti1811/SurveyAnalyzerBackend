const { faker } = require('@faker-js/faker');
const CompanyData = require('../models/CompanyData');
// Generate dummy data for 100 people

const genders = ['male', 'female'];
// const roles = ['software developer', '']
const departments = ['finance', 'tech', 'sales', 'hr', 'content', 'product'];

function createRandomUser() {
    return {
        // userid: faker.string.uuid(),
        name: faker.internet.displayName(),
        email: faker.internet.email(),
        region: faker.location.country(),
        role: faker.person.jobType(),
        department: departments[(Math.floor(Math.random() * departments.length))],
        gender: genders[(Math.floor(Math.random() * genders.length))],
        tenure: faker.number.int({min: 1, max: 30}),
        overallSatisfaction: faker.number.int({ min: 1, max: 5 }),
        jobSatisfaction: faker.number.int({ min: 1, max: 5 }),
        organizationalCulture: faker.number.int({ min: 1, max: 5 }),
        workLifeBalance: faker.number.int({ min: 2, max: 5 }),
    };
}

exports.generateData = async() => {
    const users = Array.from({ length: 500 }, createRandomUser);
    let averageOverallSatisfaction = 0;
    let averageJobSatisfaction = 0;
    let averageOrganizationalCulture = 0;
    let averageWorkLifeBalance = 0;
    
    users.forEach((user) => {
        averageOverallSatisfaction += user.overallSatisfaction;
        averageJobSatisfaction += user.jobSatisfaction;
        averageOrganizationalCulture += user.organizationalCulture;
        averageWorkLifeBalance += user.workLifeBalance;
    });
    
    averageOverallSatisfaction = averageOverallSatisfaction / users.length;
    averageJobSatisfaction = averageJobSatisfaction / users.length;
    averageOrganizationalCulture = averageOrganizationalCulture / users.length;
    averageWorkLifeBalance = averageWorkLifeBalance / users.length;

    // console.log(averageOverallSatisfaction, averageJobSatisfaction, averageOrganizationalCulture, averageWorkLifeBalance);
    // console.log(users);

    //save it to mongodb    

    await CompanyData.create({
        companyName: 'Google',
        averageOverallSatisfaction,
        averageJobSatisfaction,
        averageOrganizationalCulture,
        averageWorkLifeBalance,
        data: users
    });

    console.log('Company Data Saved successfully');

}