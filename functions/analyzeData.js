const calculateAverage = (type, n) => {
    return (type.oneStar*1 + type.twoStar*2 + type.threeStar*3 + type.fourStar*4 + type.fiveStar*5) / n;
}

exports.analyzeData = (jsonArrayObj, filters={}) => {
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
        average: 0,
    };
    const jobSatisfaction = {
        oneStar: 0,
        twoStar: 0,
        threeStar: 0,
        fourStar: 0,
        fiveStar: 0,
        average: 0,
    };
    const organizationalCulture = {
        oneStar: 0,
        twoStar: 0,
        threeStar: 0,
        fourStar: 0,
        fiveStar: 0,
        average: 0,
    };
    const workLifeBalance = {
        oneStar: 0,
        twoStar: 0,
        threeStar: 0,
        fourStar: 0,
        fiveStar: 0,
        average: 0,
    };
    const department = {
        finance: 0,
        tech: 0,
        sales: 0,
        hr: 0,
        content: 0,
        product: 0,
    };

    let formattedJsonArray = jsonArrayObj;

    if(filters?.analysis === 'tenure'){
        const {minTenure, maxTenure} = filters;

        formattedJsonArray = jsonArrayObj.filter(obj => {
            const tenure = parseInt(obj.Tenure);
            return tenure <= maxTenure && tenure >= minTenure
        });
    }

    if(filters?.analysis === 'Department'){
        const { criteria } = filters;

        formattedJsonArray = jsonArrayObj.filter(obj => {
            return obj.Department === criteria;
        });
    }

    if(filters?.analysis === 'Gender'){
        const { criteria } = filters;

        formattedJsonArray = jsonArrayObj.filter(obj => {
            return obj.Gender === criteria;
        });
    }

    if(filters?.analysis === 'Region'){
        const { criteria } = filters;

        formattedJsonArray = jsonArrayObj.filter(obj => {
            return obj.Region === criteria;
        });
    }

    formattedJsonArray.forEach((obj) => {
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

    overallSatisfaction.average = calculateAverage(overallSatisfaction, formattedJsonArray.length);
    jobSatisfaction.average = calculateAverage(jobSatisfaction, formattedJsonArray.length);
    organizationalCulture.average = calculateAverage(organizationalCulture, formattedJsonArray.length);
    workLifeBalance.average = calculateAverage(workLifeBalance, formattedJsonArray.length);

    return {
        gender,
        department,
        overallSatisfaction,
        jobSatisfaction,
        organizationalCulture,
        workLifeBalance,
    }
}

exports.analyzeCompanyData = (companyData) => {
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
        average: 0,
    };
    const jobSatisfaction = {
        oneStar: 0,
        twoStar: 0,
        threeStar: 0,
        fourStar: 0,
        fiveStar: 0,
        average: 0,
    };
    const organizationalCulture = {
        oneStar: 0,
        twoStar: 0,
        threeStar: 0,
        fourStar: 0,
        fiveStar: 0,
        average: 0,
    };
    const workLifeBalance = {
        oneStar: 0,
        twoStar: 0,
        threeStar: 0,
        fourStar: 0,
        fiveStar: 0,
        average: 0,
    };
    const department = {
        finance: 0,
        tech: 0,
        sales: 0,
        hr: 0,
        content: 0,
        product: 0,
    };

    companyData.forEach((obj) => {
        if(obj.gender === 'male'){
            gender.males += 1;
        }
        else{
            gender.females += 1;
        }

        //overallSatisfaction
        if(obj.overallSatisfaction === 1){
            overallSatisfaction.oneStar += 1;
        }
        else if(obj.overallSatisfaction === 2){
            overallSatisfaction.twoStar += 1;
        }
        else if(obj.overallSatisfaction === 3){
            overallSatisfaction.threeStar += 1;
        }
        else if(obj.overallSatisfaction === 4){
            overallSatisfaction.fourStar += 1;
        }
        else if(obj.overallSatisfaction === 5){
            overallSatisfaction.fiveStar += 1;
        }

        //jobSatisfaction
        if(obj.jobSatisfaction === 1){
            jobSatisfaction.oneStar += 1;
        }
        else if(obj.jobSatisfaction === 2){
            jobSatisfaction.twoStar += 1;
        }
        else if(obj.jobSatisfaction === 3){
            jobSatisfaction.threeStar += 1;
        }
        else if(obj.jobSatisfaction === 4){
            jobSatisfaction.fourStar += 1;
        }
        else if(obj.jobSatisfaction === 5){
            jobSatisfaction.fiveStar += 1;
        }

        //organizationalCulture
        if(obj.organizationalCulture === 1){
            organizationalCulture.oneStar += 1;
        }
        else if(obj.organizationalCulture === 2){
            organizationalCulture.twoStar += 1;
        }
        else if(obj.organizationalCulture === 3){
            organizationalCulture.threeStar += 1;
        }
        else if(obj.organizationalCulture === 4){
            organizationalCulture.fourStar += 1;
        }
        else if(obj.organizationalCulture === 5){
            organizationalCulture.fiveStar += 1;
        }

        //workLifeBalance
        if(obj.workLifeBalance === 1){
            workLifeBalance.oneStar += 1;
        }
        else if(obj.workLifeBalance === 2){
            workLifeBalance.twoStar += 1;
        }
        else if(obj.workLifeBalance === 3){
            workLifeBalance.threeStar += 1;
        }
        else if(obj.workLifeBalance === 4){
            workLifeBalance.fourStar += 1;
        }
        else if(obj.workLifeBalance === 5){
            workLifeBalance.fiveStar += 1;
        }

        //department
        if(obj.department === 'finance'){
            department.finance += 1;
        }
        else if(obj.department === 'tech'){
            department.tech += 1;
        }
        else if(obj.department === 'sales'){
            department.sales += 1;
        }
        else if(obj.department === 'hr'){
            department.hr += 1;
        }
        else if(obj.department === 'content'){
            department.content += 1;
        }
        else if(obj.department === 'product'){
            department.product += 1;
        }
    });

    overallSatisfaction.average = calculateAverage(overallSatisfaction, companyData.length);
    jobSatisfaction.average = calculateAverage(jobSatisfaction, companyData.length);
    organizationalCulture.average = calculateAverage(organizationalCulture, companyData.length);
    workLifeBalance.average = calculateAverage(workLifeBalance, companyData.length);

    return {
        gender,
        department,
        overallSatisfaction,
        jobSatisfaction,
        organizationalCulture,
        workLifeBalance,
    }
}