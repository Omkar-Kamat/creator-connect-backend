import { assetService } from "../services/asset.service.js";

export class AssetController {

  async createAsset(req, res) {

    try {

      const asset = await assetService.createAsset(
        req.file,
        req.body,
        req.user._id
      );

      res.status(201).json(asset);

    } catch (error) {

      res.status(400).json({
        message: error.message
      });

    }

  }

  async getPublicAssets(req, res) {

    try {

      const data = await assetService.getPublicAssets(req.query);

      res.json(data);

    } catch (error) {

      res.status(400).json({
        message: error.message
      });

    }

  }

  async getMyAssets(req, res) {

    try {

      const data = await assetService.getMyAssets(
        req.user._id,
        req.query
      );

      res.json(data);

    } catch (error) {

      res.status(400).json({
        message: error.message
      });

    }

  }

}

export const assetController = new AssetController();