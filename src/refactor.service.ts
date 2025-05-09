import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import ApiErrors from "./utils/apiErrors";
import Featuers from "./utils/featuers";

class RefactorService {
  getAll = <modelType>(model: mongoose.Model<any>, modelName?: string) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      let filterData: any = {};
      if (req.filterData) {
        filterData = req.filterData;
      }
      // pagination                              length document database
      const documentCount = await model.find(filterData).countDocuments();
      // Sort and fields              querySchema
      const featuers = new Featuers(model.find(filterData), req.query)
        .filter()
        .sort()
        .limitFields()
        .search(modelName!)
        .pagination(documentCount);
      const { mongooseQuery, paginationResult } = featuers; // funsh build
      const documents: modelType[] = await mongooseQuery; // executed
      //
      if (!documents) return next(new ApiErrors(`${req.__("not_found")}`, 400));
      res.status(200).json({
        pagination: paginationResult,
        length: documents.length,
        data: documents,
      });
    });

  createOne = <modelType>(model: mongoose.Model<any>) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const documents: modelType = await model.create(req.body);
      if (!documents) return next(new ApiErrors(`${req.__("not_found")}`, 400));
      res.status(201).json({ data: documents });
    });

  getOne = <modelType>(
    model: mongoose.Model<any>,
    modelName?: string,
    populationOptions?: string
  ) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      let query: any = model.findById(req.params.id);
      if (populationOptions) query = query.populate(populationOptions);
      let documents: any = await query;
      if (!documents) return next(new ApiErrors(`${req.__("not_found")}`, 400));
      res.status(200).json({ data: documents });
    });

  updateOne = <modelType>(model: mongoose.Model<any>) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const documents: modelType | null = await model.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );
      if (!documents) return next(new ApiErrors(`${req.__("not_found")}`, 400));
      res.status(200).json({ data: documents });
    });

  deleteOne = <modelType>(model: mongoose.Model<any>) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const documents: modelType | null = await model.findByIdAndDelete(
        req.params.id
      );
      if (!documents) return next(new ApiErrors(`${req.__("not_found")}`, 400));
      res.status(204).json({ data: documents });
    });
}

const refactorService = new RefactorService();
export default refactorService;
