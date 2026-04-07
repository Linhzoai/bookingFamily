import catchAsync from "../../../utils/catch.async.js";
import CategoryService from "./category.service.js";
import { successResponse } from "../../../utils/response.handle.js";
class CategoryController {

  //[POST] /api/v1/categories/create
  createCategory = catchAsync(async (req, res) => {
    const data = req.body;
    const result = await CategoryService.createCategory(data);
    return successResponse(res, { data: result, message: "Tạo danh mục thành công" }, 201);
  });

  //[PUT] /api/v1/categories/:id/update
  updateCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const result = await CategoryService.updateCategory(id, data);
    return successResponse(res, { data: result, message: "Cập nhật danh mục thành công" }, 200);
  });

  //[DELETE] /api/v1/categories/:id/delete
  deleteCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    await CategoryService.deleteCategory(id);
    return successResponse(res, { message: "Xóa danh mục thành công" }, 200);
  });

  //[GET] /api/v1/categories
  getCategories = catchAsync(async (req, res)=>{
    const data = req.validatedQuery;
    const result = await CategoryService.getAllCategories(data);
    return successResponse(res, { data: result, message: "Lấy danh sách danh mục thành công" }, 200);
  })

  //[GET] /api/v1/categories/:id/get
  getCategoryById = catchAsync(async (req, res)=>{
    const { id } = req.params;
    const result = await CategoryService.getCategoryById(id);
    return successResponse(res, { data: result, message: "Lấy danh mục thành công" }, 200);
  })
}

export default new CategoryController();