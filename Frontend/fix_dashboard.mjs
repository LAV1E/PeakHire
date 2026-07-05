import fs from 'fs';

let c = fs.readFileSync('src/app/candidate/dashboard/page.jsx', 'utf8');

c = c.replace(/const res = await applicationApi\.myApplications\(\);\n\s*return res;/g, 'const res = await applicationApi.myApplications();\n        return res.applications;');
c = c.replace(/const res = await interviewApi\.candidateList\(\{\n\s*status: \"SCHEDULED\",\n\s*\}\);\n\s*return res;/g, 'const res = await interviewApi.candidateList({\n          status: \"SCHEDULED\",\n        });\n        return res.interviews;');
c = c.replace(/const res = await offerApi\.candidateList\(\);\n\s*return res;/g, 'const res = await offerApi.candidateList();\n        return res.offers;');

c = c.replace(/offers\?\.offers/g, 'offers');
c = c.replace(/interviews\?\.interviews/g, 'interviews');
c = c.replace(/applications\?\.totalApplications \?\? 0/g, 'applications?.length ?? 0');
c = c.replace(/applications\?\.applications/g, 'applications');

fs.writeFileSync('src/app/candidate/dashboard/page.jsx', c);
console.log('Fixed candidate dashboard');
