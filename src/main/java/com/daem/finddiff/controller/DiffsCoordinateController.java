package com.daem.finddiff.controller;

import com.daem.finddiff.dto.ResponseResult;
import com.daem.finddiff.entity.DiffsCoordinate;
import com.daem.finddiff.service.DiffsCoordinateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

/**
 * @Description
 * @Author tyx
 * @Date 2021/2/7
 */
@Controller
public class DiffsCoordinateController {

    @Autowired
    private DiffsCoordinateService diffsCoordinateService;

    @PostMapping(value = "/diffsCoordinates", produces = "application/json;charset=UTF-8")
    public ResponseResult<List<DiffsCoordinate>> createDiffsCoordinate(@RequestBody List<DiffsCoordinate> diffsCoordinates) {
        return diffsCoordinateService.saveDiffsCoordinate(diffsCoordinates);
    }

    @DeleteMapping(value = "/diffsCoordinate/{id}", produces = "application/json;charset=UTF-8")
    public ResponseResult<DiffsCoordinate> createDiffsCoordinate(@PathVariable Integer id) {
        return diffsCoordinateService.delDiffsCoordinate(id);
    }

}
