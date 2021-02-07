package com.daem.finddiff.service;

import com.daem.finddiff.dao.DiffsCoordinateDao;
import com.daem.finddiff.dao.GameSceneDataDao;
import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.DiffsCoordinate;
import com.daem.finddiff.entity.GameSceneData;
import com.daem.finddiff.entity.Structure;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.List;

/**
 * @Description
 * @Author tyx
 * @Date 2021/1/26
 */
@Service
public class DiffsCoordinateService {
    @Autowired
    private DiffsCoordinateDao diffsCoordinateDao;

    @Value("${file.path}")
    private String imgPath;

    public ResponseResult<List<DiffsCoordinate>> saveDiffsCoordinate(List<DiffsCoordinate> diffsCoordinates) {
        try {
            for (int i = 0; i < diffsCoordinates.size(); i++) {
            }
            List<DiffsCoordinate> result = diffsCoordinateDao.saveAll(diffsCoordinates);
            return ResponseResult.defSuccessful(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }

    @Transactional
    public ResponseResult<DiffsCoordinate> delDiffsCoordinate(Integer id) {
        try {
            diffsCoordinateDao.deleteById(id);
            return ResponseResult.defSuccessful();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseResult.defFailed("数据异常！", e.getMessage());
        }
    }
}
