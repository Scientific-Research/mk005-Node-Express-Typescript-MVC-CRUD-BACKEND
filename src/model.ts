import fs from 'fs';

import rawJobs from './data/jobs.json';
import skillInfos from './data/skillInfos.json';
import {
  IJobs,
  IRawJob,
  ISkillInfos,
  nullObjectSkill,
  TotaledSkill,
} from './interface';

export const getApiDocumentationHtml = () => {
  return `<h1>GET A JOB API</h1> <ul>
  <li><a href="/jobs">/jobs</a>- returns an array of job objects</li>
  </ul>`;
};

export const getApiInstructionsHtml = () => {
  return `
<style>
a, h1 {
    background-color: #ddd;
    font-family: courier;
}
</style>
<h1>GETAJOB API</h1>
<ul>
    <li><a href="jobs">/jobs</a> - array of job listings will all fields</li>
    <li><a href="todos">/todos</a> - array of todos with todo/company/title fields</li>
    <li><a href="totaledSkills">/totaledSkills</a> - array of skills with totals how often they occur in job listings</li>
</ul>
    `;
};

export const getJobs = () => {
  const jobs: IJobs[] = [];
  rawJobs.forEach((rawJob: IRawJob) => {
    const job: IJobs = {
      ...rawJob,
      // skills: [],
      skills: buildSkills(rawJob.skillList),
    };
    jobs.push(job);
  });
  return jobs;
};

export const buildSkills = (skillList: string) => {
  const skillIdCodes = skillList.split(',').map((s) => s.trim());
  // console.log(skillIdCodes); ["angular", "cicd", "testing", "hotjar", "piwik"]

  const skills: ISkillInfos[] = [];
  skillIdCodes.forEach((skillIdCode, i) => {
    // First Solution:
    const _skillIdCode = skillIdCodes[i];
    // console.log(_skillIdCode); //'angular','cicd','testing','hotjar','piwik',...

    const skill = skillInfos.find(
      (info: ISkillInfos) => info.idCode === _skillIdCode
      // (info: ISkillInfos) => info.idCode === skillIdCode
    );

    // Second Solution:
    // const skill = skillInfos.find(
    //   // (info: ISkillInfos) => info.idCode === _skillIdCode
    //   (info: ISkillInfos) => info.idCode === skillIdCode
    // );

    /* skill : {
          idCode: 'angular',
          name: 'Angular',
          url: 'https://onespace.pages.dev/techItems?id=36',
          description: 'together with React and Vue.js one of the three most popular JavaScript frameworks'
      } */

    // let skill: ISkillInfos;
    // if (_skill !== undefined) {
    if (skill) {
      // skill = {
      //   // ...nullObjectSkill,
      //   // idCode: skillIdCode,
      // };
      // skill = {
      //   ..._skill,
      //   // idCode: skillIdCode,
      // };
      skills.push(skill);
      // skills.push(_skill);
    }
    // else {
    //   // skill = {
    //   //   ..._skill,
    //   //   // idCode: skillIdCode,
    //   // };
    // }
  });
  // console.log(skillList);
  // return [];
  return skills;
};

export const getTodos = () => {
  const todos = rawJobs.map((job) => {
    return {
      todo: job.todo,
      company: job.company,
      title: job.title,
      url: job.url,
    };
  });
  return todos;
};

export const getTotaledSkills = () => {
  const totaledSkills: TotaledSkill[] = [];
  getJobs().forEach((job) => {
    job.skills.forEach((skill) => {
      const existingTotaledSkill = totaledSkills.find(
        (totaledSkill) => totaledSkill.skill.idCode === skill.idCode
      );
      if (!existingTotaledSkill) {
        totaledSkills.push({
          skill,
          total: 1,
        });
      } else {
        existingTotaledSkill.total++;
      }
    });
  });
  return totaledSkills;
};

export const getSkillsWithList = (skillList: string) => {
  const skills: ISkillInfos[] = [];
  const skillIdCodes = skillList.split(',').map((m) => m.trim());
  skillIdCodes.forEach((skillIdCode) => {
    const skill: ISkillInfos = lookupSkill(skillIdCode);
    skills.push(skill);
  });
  return skills;
};

export const lookupSkill = (idCode: string): ISkillInfos => {
  // const _skill = (skillInfos as ISkillInfos[]).find(
  //   (info) => info.idCode === idCode
  // );

  const _skill = (skillInfos as ISkillInfos[]).find(
    (skill) => skill.idCode === idCode
  );

  if (_skill === undefined) {
    return {
      ...nullObjectSkill,
      idCode,
    };
  } else {
    return {
      ..._skill,
      idCode,
    };
  }
};
