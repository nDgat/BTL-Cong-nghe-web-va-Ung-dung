const { Op } = require('sequelize');

// Build pagination options from query params
const getPagination = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 10, 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

// Build pagination response
const getPaginationData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const totalPages = Math.ceil(totalItems / limit);
  return {
    items,
    pagination: {
      totalItems,
      totalPages,
      currentPage: page,
      itemsPerPage: limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

// Build search/filter conditions
const buildWhereClause = (query, searchFields = [], filterFields = []) => {
  const where = {};

  // Search across multiple fields
  if (query.search && searchFields.length > 0) {
    where[Op.or] = searchFields.map(field => ({
      [field]: { [Op.like]: `%${query.search}%` },
    }));
  }

  // Exact filters
  filterFields.forEach(field => {
    if (query[field] !== undefined && query[field] !== '') {
      where[field] = query[field];
    }
  });

  return where;
};

// Build sort order
const buildOrder = (query, defaultSort = 'created_at', defaultDir = 'DESC') => {
  const sortBy = query.sortBy || defaultSort;
  const sortDir = (query.sortDir || defaultDir).toUpperCase();
  return [[sortBy, sortDir === 'ASC' ? 'ASC' : 'DESC']];
};

// Calculate letter grade from score
const calculateLetterGrade = (score) => {
  if (score === null || score === undefined) return null;
  if (score >= 9.0) return 'A+';
  if (score >= 8.5) return 'A';
  if (score >= 8.0) return 'B+';
  if (score >= 7.0) return 'B';
  if (score >= 6.5) return 'C+';
  if (score >= 5.5) return 'C';
  if (score >= 5.0) return 'D+';
  if (score >= 4.0) return 'D';
  return 'F';
};

// Calculate final grade from components
const calculateFinalGrade = (grades, formula) => {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const grade of grades) {
    const weight = formula[grade.component] || grade.weight || 0;
    if (grade.score !== null && grade.score !== undefined) {
      weightedSum += grade.score * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight === 0) return null;
  return Math.round((weightedSum / totalWeight) * 100) / 100;
};

module.exports = {
  getPagination,
  getPaginationData,
  buildWhereClause,
  buildOrder,
  calculateLetterGrade,
  calculateFinalGrade,
};
