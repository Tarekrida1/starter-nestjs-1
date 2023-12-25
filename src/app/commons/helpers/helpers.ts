import { ModifiedQuery } from '@interfaces';
import * as mongoose from 'mongoose';

export const modifiedQuery = (
  query: any,
  removeprops: any[],
  mongooseIds: string[] = [],
  booleanList: string[] = [],
) => {
  const queryData = { ...query };
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 9;
  const startIndex = (page - 1) * limit;
  const sort = query.sort ? JSON.parse(query.sort) : { createdAt: -1 };
  const removeFields = [
    ...removeprops,
    'select',
    'sortDesc',
    'page',
    'limit',
    'sortAsc',
    'sort',
  ];
  removeFields.forEach((param) => delete queryData[param]);
  console.log('queryData.entities()', queryData);
  Object.keys(queryData).forEach(function (key) {
    console.log('key', key)
    console.log('mongooseIds', mongooseIds)
    if ((mongooseIds || []).includes(key)) {
      queryData[key] = `${queryData[key]}`?.split(',')?.length === 0 ? new mongoose.Types.ObjectId(queryData[key]) : {"$in" : `${queryData[key]}`?.split(',')?.map(el => new mongoose.Types.ObjectId(el))};
    }
  });

  Object.keys(queryData).forEach(function (key) {
    if ((booleanList || []).includes(key)) {
      queryData[key] = JSON.parse(`${queryData[key]}`)
    }
  });
  console.log('queryData.entities()2', queryData);

  const modifiedQueryData: ModifiedQuery = {
    query: queryData,
    sort: sort,
    page: page,
    limit: limit,
    skip: startIndex,
  };
  return modifiedQueryData;
};

export const Glookup = (
  from: string,
  localField: string,
  hasUnwind = true
): any[] => {
  const lookupArr: any[] = [
    {
      $lookup: {
        from: from,
        localField: localField,
        foreignField: '_id',
        as: localField,
      },
    },
  ];
  const unwind = {
    $unwind: { path: '$' + localField, preserveNullAndEmptyArrays: true },
  };
  hasUnwind && lookupArr.push(unwind);
  return lookupArr;
};

export const selectedFields = (selectedfileds: any[]): any => {
  //   var project1 =   selectedfileds.reduce((acc,curr)=> (acc[curr]=1,acc),{});
  // var project2 = deSelectedfileds.reduce((ac,a) => ({...ac,[a]:0}),{});
  // var project = Object.assign( {}, project1, project2 );
  // console.log(project);
  return {
    $project: {
      ...selectedfileds.reduce((acc, curr) => ((acc[curr] = 1), acc), {}),
    },
  };
};

export const aggRes = (): any[] => {
  const res: any[] = [
    { $unwind: '$count' },
    {
      $project: {
        success: true,
        total: '$count.count',
        length: { $size: '$data' },
        data: '$data',
      },
    },
  ];
  return res;
};

export const ChangeToSlug = (title = ''): string => {
  title = `${title}`
    // eslint-disable-next-line no-useless-escape
    .replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ')
    .toLowerCase();
  title = title.replace(/\s+/g, '-');
  return title;
};


export const generateRandomNumber = () => Math.floor(1000000 + Math.random() * 900000);


export const mergeToArrays = (a: any[] = [],b: any[] =[]): any[] => {
  let arr :any[] = [];
  console.log('a', a)
  console.log('b', b)
  if(a?.length && b?.length) {
    const merged :any[] = a.concat(b);
    arr =  Array.from(new Set(merged));
  }
  console.log('arr', arr)
  return arr;
}
