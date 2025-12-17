import { Request, Response, RequestHandler } from "express";
import { ServiceResponse, handleServiceResponse } from "@/common/utils/serviceResponse";
import { CreateCategorySchema, UpdateCategorySchema, CategoryResponse } from "./categoryModel";
import { categoryService } from "./categoryService";

class CategoryController {
  public createCategory: RequestHandler = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== "ADMIN") {
      return handleServiceResponse(
        ServiceResponse.failure("You do not have permission to perform this action", null, 403),
        res
      );
    }

    const userId = req.user.id;
    const data = CreateCategorySchema.parse(req.body);
    const serviceResponse: ServiceResponse<CategoryResponse | null> = await categoryService.create(data, userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getCategoryById: RequestHandler = async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    const serviceResponse: ServiceResponse<CategoryResponse | null> = await categoryService.getById(categoryId);
    return handleServiceResponse(serviceResponse, res);
  };

  public getAllCategories: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse: ServiceResponse<CategoryResponse[] | null> = await categoryService.getAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public updateCategory: RequestHandler = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== "ADMIN") {
      return handleServiceResponse(
        ServiceResponse.failure("You do not have permission to perform this action", null, 403),
        res
      );
    }

    const userId = req.user.id;
    const categoryId = req.params.id;
    const data = UpdateCategorySchema.parse(req.body);
    const serviceResponse: ServiceResponse<CategoryResponse | null> = await categoryService.update(categoryId, data, userId);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteCategory: RequestHandler = async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== "ADMIN") {
      return handleServiceResponse(
        ServiceResponse.failure("You do not have permission to perform this action", null, 403),
        res
      );
    }

    const userId = req.user.id;
    const categoryId = req.params.id;
    const serviceResponse: ServiceResponse<CategoryResponse | null> = await categoryService.delete(categoryId, userId);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const categoryController = new CategoryController();
