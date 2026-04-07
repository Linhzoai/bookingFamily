const successResponse = (res, { data = null, message = "OK", code = 200 } = {}) => {
  return res.status(code).json({ success: true, code, message, data, });
};

const errorResponse = (res, { message = "Internal Server Error", code = 500, errors = null } = {}) => {
  return res.status(code).json({ success: false, code, message, ...(errors && { errors }), });
};

const pagination = (page, limit, totalPages, totalRecords) => {
  const isAll = page === null || limit === null;
  return {
    pageNumber: isAll ? null : Number(page),
    pageSize: isAll ? null : Number(limit),
    totalPages: Number(totalPages),
    totalRecords: Number(totalRecords),
    hasNextPage: isAll ? false : Number(page) < Number(totalPages),
    hasPrevPage: isAll ? false : Number(page) > 1,
  };
};
export { successResponse, errorResponse, pagination };
